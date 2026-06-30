import { Response, NextFunction } from "express";
import { AuthRequest } from "./validar-jwt";

export const esAdminODuenio = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se intentó verificar el rol sin valida el token antes'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'admin' && rol !== 'duenio') {
        return res.status(403).json({
            msg: `Acceso denegado: ${nombre} no tiene los permisos suficientes para realizar esta accion`
        })
    }

    next();
}