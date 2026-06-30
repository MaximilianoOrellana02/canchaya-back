import { Router } from 'express';
import {
    crearReserva,
    getMisReservas,
    getReservasComplejo,
    cancelarReserva,
    obtenerHorariosDisponibles
} from '../controllers/reservas.controller';

import { registrarAuditoria } from '../middlewares/auditoria';

import { validarJwt } from '../middlewares/validar-jwt';

const router = Router();

//  Rutas Públicas

// Obtener horarios disponibles para una cancha en una fecha específica
// Ejemplo de uso: GET /api/reservas/cancha/1/horarios?fecha=2026-06-28
router.get('/cancha/:cancha_id/horarios', obtenerHorariosDisponibles);


// Rutas Privadas (Requieren estar logueado)

// Obtener todas las reservas del usuario que hace la petición
router.get('/mis-reservas', validarJwt, getMisReservas);

// Crear una nueva reserva
router.post('/', validarJwt, crearReserva);

// Cancelar una reserva específica (solo si pertenece al usuario logueado)
router.patch('/:id/cancelar',
    validarJwt,
    registrarAuditoria('CANCELAR_RESERVA', 'Reservas'),
    cancelarReserva
);


// Rutas de Dueños de Complejo

// Obtener toda la agenda de reservas de un complejo (valida que el req.usuario sea el dueño)
router.get('/complejo/:complejo_id', validarJwt, getReservasComplejo);

export default router;