import { Request, Response } from "express";
import { Cancha, Complejo } from "../models"
import { AuthRequest } from "../middlewares/validar-jwt";

export const crearCancha = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, tipo, precio, duracion_turno, complejo_id } = req.body;

        if (!nombre || !tipo || !precio || !duracion_turno || !complejo_id) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios para crear la cancha' });
        }

        const complejo = await Complejo.findByPk(complejo_id);

        if (!complejo) {
            return res.status(404).json({ msg: 'El complejo indicado no existe' });
        }

        if (complejo.getDataValue('usuario_duenio') !== req.usuario?.id) {
            return res.status(403).json({
                msg: 'No podés agregar canchas a un complejo que no te pertenece'
            });
        }

        const nuevaCancha = await Cancha.create({
            nombre,
            tipo,
            precio,
            duracion_turno,
            complejo_id,
            estado: true
        })

        return res.status(201).json({
            msg: 'Cancha creada con exito',
            cancha: nuevaCancha
        })

    } catch (error) {
        console.error('Error al crear la cancha:', error);
        return res.status(500).json({ msg: 'Error interno del servidor al crear la cancha' });
    }
}

export const getCanchas = async (req: Request, res: Response) => {
    try {
        const canchas = await Cancha.findAll();
        return res.status(200).json(canchas)
    } catch (error) {
        console.error('Error al obtener canchas:', error);
        return res.status(500).json({ msg: 'Error interno al obtener las canchas' });
    }
}

export const getCanchasPorComplejo = async (req: Request, res: Response) => {
    try {
        const { complejo_id } = req.params;

        const canchas = await Cancha.findAll({
            where: {
                complejo_id,
                estado: true
            }
        });

        return res.status(200).json({
            msg: 'Lista de canchas del complejo',
            canchas
        })

    } catch (error) {
        console.error('Error al obtener canchas:', error);
        return res.status(500).json({ msg: 'Error interno al obtener las canchas' });
    }
}

export const actualizarCancha = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, precio, duracion_turno, estado } = req.body;

        const cancha = await Cancha.findByPk(id as string, {
            include: [{ model: Complejo, as: 'complejo' }]
        });

        if (!cancha) {
            return res.status(404).json({ msg: 'Cancha no encontrada' });
        }

        const complejoDeCancha = cancha.getDataValue('complejo');
        if (complejoDeCancha.usuario_duenio !== req.usuario?.id) {
            return res.status(403).json({
                msg: 'No tenés permisos para editar esta cancha'
            });
        }

        const camposAActualizar: any = {};
        if (nombre) camposAActualizar.nombre = nombre;
        if (tipo) camposAActualizar.tipo = tipo;
        if (precio) camposAActualizar.precio = precio;
        if (duracion_turno) camposAActualizar.duracion_turno = duracion_turno;
        if (estado !== undefined) camposAActualizar.estado = estado;

        await cancha.update(camposAActualizar);

        return res.status(200).json({
            msg: 'Cancha actualizada con éxito',
            cancha
        });

    } catch (error) {
        console.error('Error al actualizar la cancha:', error);
        return res.status(500).json({ msg: 'Error interno al actualizar la cancha' });
    }
};

export const eliminarCancha = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const cancha = await Cancha.findByPk(id as string, {
            include: [{ model: Complejo, as: 'complejo' }]
        });

        if (!cancha) {
            return res.status(404).json({ msg: 'Cancha no encontrada' });
        }

        const complejoDeCancha = cancha.getDataValue('complejo');
        if (complejoDeCancha.usuario_duenio !== req.usuario?.id) {
            return res.status(403).json({
                msg: 'No tenés permisos para eliminar esta cancha'
            });
        }
        await cancha.destroy();

        return res.status(200).json({
            msg: 'Cancha eliminada con éxito'
        });

    } catch (error) {
        console.error('Error al eliminar la cancha:', error);
        return res.status(500).json({ msg: 'Error interno al eliminar la cancha' });
    }
};