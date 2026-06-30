import { Router } from 'express';
import {
    crearCancha,
    getCanchasPorComplejo,
    actualizarCancha,
    eliminarCancha,
    getCanchas
} from '../controllers/canchas.controller';

import { validarJwt } from '../middlewares/validar-jwt';

const router = Router();

// Rutas Públicas

// Obtener todas las canchas activas que pertenecen a un complejo
router.get('/complejo/:complejo_id', getCanchasPorComplejo);

//Obtener todas las canchas
router.get('/', getCanchas)


// Rutas de Dueños de Complejo

// Crear una nueva cancha (el controlador ya valida que el usuario sea dueño del complejo_id)
router.post('/', validarJwt, crearCancha);

// Actualizar los datos de una cancha
router.put('/:id', validarJwt, actualizarCancha);

// Eliminar una cancha de forma permanente
router.delete('/:id', validarJwt, eliminarCancha);

export default router;