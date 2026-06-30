import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    usuario?: any;
}

export const validarJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado: No hay token en la petición' });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || 'MiFirmaSecretaSuperSeguraParaElTP123'
        )

        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Acceso denegado: Token no válido o expirado' });
    }
}