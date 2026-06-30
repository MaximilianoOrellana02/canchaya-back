import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import { AuthRequest } from "../middlewares/validar-jwt";

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios)
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        res.status(500).json({
            msg: 'Error interno del sistema'
        })
    }
}

export const getUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id as string);

        if (!usuario) {
            return res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            })
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener al usuario', error);
        res.status(500).json({
            msg: 'Error interno del sistema'
        })
    }
}

export const actualizarUsuario = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.usuario?.id;
        const { nombre, apellido, email, password } = req.body;

        const usuario = await Usuario.findByPk(id as string);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (nombre) {
            usuario.nombre = nombre;
        }

        if (apellido) {
            usuario.apellido = apellido;
        }

        if (email) {
            const emailDuplicado = await Usuario.findOne({
                where: { email }
            });

            if (emailDuplicado && emailDuplicado.id !== id) {
                return res.status(400).json({
                    msg: 'El correo ya esta en uso',
                })
            }

            usuario.email = email;
        }

        if (password) {
            usuario.password = password;
        }

        await usuario.save()

        return res.status(200).json({
            msg: 'Perfil actualizado con exito',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        })

    } catch (error) {
        console.error('Error al actualizar usuario', error);
        res.status(500).json({
            msg: 'Error interno del sistema'
        })
    }
}

export const cambiarRol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nuevoRol } = req.body;

        const rolesValidos = ['admin', 'duenio', 'jugador'];
        if (!rolesValidos.includes(nuevoRol)) {
            return res.status(400).json({
                msg: `El rol '${nuevoRol}' no es válido. Los roles permitidos son: ${rolesValidos.join(', ')}`
            });
        }

        const usuario = await Usuario.findByPk(id as string);
        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            })
        }

        usuario.rol = nuevoRol;

        await usuario.save();

        return res.status(200).json({
            msg: `El rol de ${usuario.nombre} ${usuario.apellido} fue actualizado a ${usuario.rol} con exito`,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        })
    } catch (error) {
        console.error('Error al cambiar rol', error);
        res.status(500).json({
            msg: 'Error interno del sistema'
        })
    }
}