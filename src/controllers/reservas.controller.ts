import { Response, Request } from "express";
import { Reserva, Cancha, Complejo } from "../models/index";
import { AuthRequest } from "../middlewares/validar-jwt";
import { Op, where } from "sequelize"; // Necesitamos los operadores de Sequelize

export const crearReserva = async (req: AuthRequest, res: Response) => {
    try {
        const { cancha_id, fecha, hora_inicio, hora_fin, monto_total } = req.body;

        const usuario_id = req.usuario?.id;

        if (!cancha_id || !fecha || !hora_inicio || !hora_fin || !monto_total) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios para generar la reserva' });
        }
        //Logica para verificar que la cancha no este ocupada en fercha y hora
        const reservaOcupada = await Reserva.findOne({
            where: {
                cancha_id,
                fecha,
                estado_reserva: { [Op.ne]: 'cancelada' },
                [Op.and]: [
                    { hora_inicio: { [Op.lt]: hora_fin } }, // El inicio guardado es menor al fin solicitado
                    { hora_fin: { [Op.gt]: hora_inicio } }  // El fin guardado es mayor al inicio solicitado
                ]
            }
        })

        if (reservaOcupada) {
            return res.status(400).json({
                msg: 'La cancha ya se encuentra reservada en ese horario. Por favor, elegí otro.'
            });
        }


        const nuevaReserva = await Reserva.create({
            usuario_id,
            cancha_id,
            fecha,
            hora_inicio,
            hora_fin,
            monto_total,
            estado_reserva: 'pendiente'
        })

        return res.status(201).json({
            msg: 'Turno reservado con éxito. A la espera de confirmacion de pago.',
            reserva: nuevaReserva
        })

    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ msg: 'Error interno del servidor al crear la reserva' });
    }
}

export const getMisReservas = async (req: AuthRequest, res: Response) => {
    try {
        const usuario_id = req.usuario?.id;

        const reservas = await Reserva.findAll({
            where: {
                usuario_id
            },
            include: [{
                model: Cancha,
                as: 'cancha',
                include: [{
                    model: Complejo,
                    as: 'complejo'
                }]
            }],
            order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        });

        return res.status(200).json({
            msg: 'Historial de reservas del jugador',
            reservas
        });

    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return res.status(500).json({ msg: 'Error interno al obtener el historial de reservas' });
    }
}

export const getReservasComplejo = async (req: AuthRequest, res: Response) => {
    try {
        const { complejo_id } = req.params;
        const usuario_id = req.usuario?.id;

        const complejo = await Complejo.findByPk(complejo_id as string);

        if (!complejo) {
            return res.status(404).json({ msg: 'Complejo no encontrado' });
        }

        // --------------------------------------------------------

        if (String(complejo.getDataValue('usuario_duenio')) !== String(usuario_id)) {
            return res.status(403).json({
                msg: 'No tenés permisos para ver la agenda de este complejo'
            });
        }

        const reservas = await Reserva.findAll({
            include: [{
                model: Cancha,
                as: 'cancha',
                where: { complejo_id }
            }],
            order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
        })

        return res.status(200).json({
            msg: 'Agenda del complejo',
            reservas
        });

    } catch (error) {
        console.error('Error al obtener la agenda del complejo:', error);
        return res.status(500).json({ msg: 'Error interno al obtener la agenda' });
    }
}

export const cancelarReserva = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario?.id;

        const reserva = await Reserva.findByPk(id as string);

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        if (reserva.getDataValue('usuario_id') !== usuario_id) {
            return res.status(403).json({ msg: 'No podés cancelar una reserva que no te pertenece' });
        }

        if (reserva.getDataValue('estado_reserva') === 'finalizada') {
            return res.status(400).json({ msg: 'No podés cancelar un turno que ya finalizó' });
        }

        await reserva.update({ estado_reserva: 'cancelada' });

        return res.status(200).json({
            msg: 'La reserva fue cancelada exitosamente',
            reserva
        });

    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        return res.status(500).json({ msg: 'Error interno al cancelar la reserva' });
    }
};

const horaAMinutos = (horaString: string) => {
    const [horas, minutos] = horaString.split(':').map(Number);
    return horas * 60 + minutos;
};

const minutosAHora = (minutosTotales: number) => {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
};

export const obtenerHorariosDisponibles = async (req: Request, res: Response) => {
    try {
        const { cancha_id } = req.params;
        const { fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({ msg: 'Debes proporcionar una fecha' });
        }

        const cancha = await Cancha.findByPk(cancha_id as string, {
            include: [{ model: Complejo, as: 'complejo' }]
        });

        if (!cancha) {
            return res.status(404).json({ msg: 'Cancha no encontrada' });
        }

        const complejo = cancha.getDataValue('complejo');
        const duracion = cancha.getDataValue('duracion_turno');

        const reservasOcupadas = await Reserva.findAll({
            where: {
                cancha_id,
                fecha: fecha as string,
                estado_reserva: { [Op.ne]: 'cancelada' } // Que no sea igual a cancelada
            }
        });

        const aperturaMin = horaAMinutos(complejo.hora_apertura);
        let cierreMin = horaAMinutos(complejo.hora_cierre);
        if (cierreMin === 0) cierreMin = 1440;

        const horariosDisponibles = [];
        let tiempoActual = aperturaMin;

        while (tiempoActual + duracion <= cierreMin) {
            const horaInicioBloque = minutosAHora(tiempoActual);
            const horaFinBloque = minutosAHora(tiempoActual + duracion);

            const estaOcupado = reservasOcupadas.some(reserva => {
                const inicioReserva = reserva.getDataValue('hora_inicio').substring(0, 5);
                const finReserva = reserva.getDataValue('hora_fin').substring(0, 5);

                return (
                    (horaInicioBloque >= inicioReserva && horaInicioBloque < finReserva) ||
                    (horaFinBloque > inicioReserva && horaFinBloque <= finReserva) ||
                    (horaInicioBloque <= inicioReserva && horaFinBloque >= finReserva)
                );
            });

            if (!estaOcupado) {
                horariosDisponibles.push({
                    hora_inicio: horaInicioBloque,
                    hora_fin: horaFinBloque
                });
            }

            tiempoActual += duracion;
        }

        return res.status(200).json({
            msg: `Horarios disponibles para el ${fecha}`,
            horarios: horariosDisponibles
        });

    } catch (error) {
        console.error('Error al obtener horarios:', error);
        return res.status(500).json({ msg: 'Error interno del servidor al calcular horarios' });
    }
};