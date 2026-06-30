import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.model";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(404).json({
                msg: 'El correo ingresado no existe'
            })
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol,
                nombre: usuario.nombre
            },
            process.env.JWT_SECRET || 'FirmaDeRespaldoPorSiFallaElEnv',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            msg: 'Login existoso',
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hubo un error en el servidor al intentar iniciar sesión' });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, rol, apellido } = req.body;

        const existeUsuario = await Usuario.findOne({
            where: { email }
        });

        if (existeUsuario) {
            return res.status(400).json({
                msg: 'El correo electronica ya esta registrado'
            })
        }

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            email,
            password,
            rol: rol || 'jugador' //Por defecto
        });

        return res.status(201).json({
            msg: 'Usuario registrado con exito',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hubo un error en el servidor al intentar registrar el usuario' });
    }
}