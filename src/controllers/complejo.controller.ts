import { Request, Response } from "express";
import { Cancha, Complejo } from "../models"
import { AuthRequest } from "../middlewares/validar-jwt";
import { includes } from "zod";
import { json } from "sequelize";

//1. Crear un complejo
export const crearComplejo = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, direccion, telefono, latitud, longitud, hora_apertura, hora_cierre } = req.body;

        if (!nombre || !direccion || !telefono || !hora_apertura || !hora_cierre) {
            return res.status(400).json({
                msg: 'Los campos nombre, direccion, telefono y horarios son obligatorios'
            });
        }

        const existeComplejo = await Complejo.findOne({
            where: { nombre },
        })

        if (existeComplejo) {
            return res.status(400).json({
                msg: 'El complejo ya existe'
            })
        }

        const nuevoComplejo = await Complejo.create({
            nombre,
            direccion,
            telefono,
            latitud,
            longitud,
            hora_apertura,
            hora_cierre,
            estado: 'pendiente',
            usuario_duenio: req.usuario?.id
        });

        return res.status(200).json({
            msg: 'Complejo creado con exito',
            complejo: nuevoComplejo
        })

    } catch (error) {
        console.error('Error al crear el complejo:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar crear el complejo'
        });
    }
}

//2. Obtener todos los complejos habiltados
export const getComplejos = async (req: Request, res: Response) => { //PUBLICOS
    try {
        const complejos = await Complejo.findAll({
            where: {
                estado: 'aprobado',
            }
        });
        return res.status(200).json({
            msg: 'Lista de todos los complejos habilitados',
            complejos: complejos
        })
    } catch (error) {
        console.error('Error al obtener complejos:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar obtener los complejos'
        });
    }
}


//3. Obtener los complejos de un duenio en especifico
export const getMisComplejos = async (req: AuthRequest, res: Response) => {
    try {
        const complejos = await Complejo.findAll({
            where: {
                usuario_duenio: req.usuario?.id
            }
        });

        return res.status(200).json({
            msg: "Lista de los complejos de dueño",
            complejos: complejos
        })
    } catch (error) {
        console.error('Error al obtener complejos:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar obtener los complejos'
        });
    }
}

//4. Obtner complejo por id
export const getComplejoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const complejo = await Complejo.findByPk(id as string, {
            include: [{
                model: Cancha,
                as: 'canchas'
            }]
        })

        if (!complejo) {
            return res.status(404).json({
                msg: 'Complejo no encontrado'
            })
        }

        return res.status(200).json({
            msg: 'Detalle del complejo:',
            complejo: complejo
        })
    } catch (error) {
        console.error('Error al obtener el complej:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar obtener el complejo'
        });
    }
}

//5. Actualizar complejo
export const updateComplejo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, hora_apertura, hora_cierre } = req.body

        const complejo = await Complejo.findByPk(id as string);

        if (!complejo) {
            return res.status(404).json({
                msg: 'Complejo no encontrado'
            })
        }

        if (complejo.getDataValue('usuario_duenio') !== req.usuario?.id) {
            return res.status(403).json({
                msg: 'Acceso denegado: No tienes permisos para editar este complejo'
            })
        }

        const camposAActualizar: any = {};

        if (nombre) camposAActualizar.nombre = nombre;
        if (direccion) camposAActualizar.direccion = direccion;
        if (telefono) camposAActualizar.telefono = telefono;
        if (hora_apertura) camposAActualizar.hora_apertura = hora_apertura;
        if (hora_cierre) camposAActualizar.hora_cierre = hora_cierre;

        await complejo.update(camposAActualizar);

        return res.status(200).json({
            msg: 'Complejo actualizado con éxito',
            complejo: complejo
        });
    } catch (error) {
        console.error('Error al actualizar complejo:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar actualizar complejo'
        });
    }
}

export const actualizarEstado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nuevoEstado } = req.body;

        const estadosValidos = ['pendiente', 'aprobado', 'suspendido'];

        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({
                msg: `El estado ${nuevoEstado} no es valido`
            })
        }

        const complejo = await Complejo.findByPk(id as string);

        if (!complejo) {
            return res.status(404).json({
                msg: 'Complejo no encontrado'
            })
        }

        await complejo.update({ estado: nuevoEstado })

        return res.status(200).json({
            msg: 'Estado del complejo actualizado',
            complejo: complejo
        })
    } catch (error) {
        console.error('Error al cambiar el estado del complejo:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar cambiar el estado'
        });
    }
}

export const eliminarComplejo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const complejo = await Complejo.findByPk(id as string);

        if (!complejo) {
            return res.status(404).json({
                msg: 'Complejo no encontrado'
            })
        }

        if (complejo.getDataValue('usuario_duenio') !== req.usuario?.id) {
            return res.status(403).json({
                msg: `Acceso denegado: No tenes permiso para eliminar este complejo`
            })
        }

        await complejo.destroy()

        return res.status(200).json({ msg: 'Complejo eliminado' })

    } catch (error) {
        console.error('Error al eliminar complejo:', error);
        return res.status(500).json({
            msg: 'Hubo un error interno en el servidor al intentar eliminar complejo'
        });
    }
}