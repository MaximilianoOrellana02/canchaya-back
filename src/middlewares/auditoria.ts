import { Response, NextFunction } from "express";
import { Auditoria } from "../models/index";
import { AuthRequest } from "./validar-jwt";

export const registrarAuditoria = (accion: string, entidad: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        next();

        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const usuario_id = req.usuario?.id;

                    const entidad_id = req.params.id || req.params.complejo_id || req.body.complejo_id || req.body.cancha_id || null;

                    const ip = req.ip || req.socket.remoteAddress || 'IP Desconocida';
                    const navegador = req.headers['user-agent'] || 'Navegador Desconocido';

                    if (usuario_id) {
                        await Auditoria.create({
                            usuario_id,
                            accion,
                            entidad,
                            entidad_id,
                            ip,
                            navegador
                        })
                    }
                } catch (error) {
                    console.error('Error silencioso al registrar auditoría:', error);
                }
            }
        })
    }
}