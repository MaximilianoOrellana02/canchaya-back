import { Request, Response } from "express";
import { Valoracion, Complejo, Usuario } from "../models";
import { AuthRequest } from "../middlewares/validar-jwt";

export const crearValoracion = async (req: AuthRequest, res: Response) => {
    try {
        const { complejo_id, puntaje, comentario } = req.body;
        const usuario_id = req.usuario?.id;

        if (!complejo_id || !puntaje) {
            return res.status(400).json({
                msg: 'El complejo y el puntaje son obligatorios',
            })
        }

        if (puntaje < 1 || puntaje > 5) {
            return res.status(400).json({
                msg: 'El puntaje debe ser un valor entre 1 y 5'
            })
        }

        const complejo = await Complejo.findByPk(complejo_id);

        if (!complejo) {
            return res.status(404).json({
                msg: 'Complejo no encontrado'
            })
        }

        const valoracionPrevia = await Valoracion.findOne({
            where: {
                usuario_id,
                complejo_id
            }
        });

        if (valoracionPrevia) {
            return res.status(400).json({
                msg: 'Ya dejaste una reseña para este complejo anteriormente'
            })
        }

        //Crear reseña
        const nuevaValoracion = await Valoracion.create({
            usuario_id,
            complejo_id,
            puntaje,
            comentario
        });

        return res.status(201).json({
            msg: 'Valoración guardada con éxito',
            valoracion: nuevaValoracion
        });
    } catch (error) {
        console.error('Error al crear valoración:', error);
        return res.status(500).json({ msg: 'Error interno del servidor al crear la valoración' });
    }
}

//Valoraciones de un complejo
export const getValoracionesComplejo = async (req: Request, res: Response) => {
    try {
        const { complejo_id } = req.params;

        const valoraciones = await Valoracion.findAll({
            where: { complejo_id },
            include: [{
                model: Usuario,
                as: 'autor',
                attributes: ['nombre', 'apellido']
            }]
        })

        return res.status(200).json({
            msg: 'Lista de valoraciones',
            total: valoraciones.length,
            valoraciones
        })
    } catch (error) {
        console.error('Error al obtener valoraciones:', error);
        return res.status(500).json({ msg: 'Error interno al obtener las valoraciones' });
    }
}