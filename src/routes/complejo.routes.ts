import { Router } from "express";
import {
    crearComplejo,
    getComplejos,
    getMisComplejos,
    getComplejoPorId,
    updateComplejo,
    actualizarEstado,
    eliminarComplejo,
} from '../controllers//complejo.controller'

import { validarJwt } from "../middlewares/validar-jwt";

const router = Router()

//Rutas Publicas

//Obtener todos los complejos
router.get('/', getComplejos);

//Obtener un complejo pot su ID
router.get('/:id', getComplejoPorId)


//Rutas privadas

//crear complejo
router.post('/', validarJwt, crearComplejo)

//Obtener los complejos del dueño que este logueado
router.get('/auth/mis-complejos', validarJwt, getMisComplejos)

//Actualizar complejo
router.put('/:id', validarJwt, updateComplejo)

// Eliminar un complejo (verifica que el usuario logueado sea el dueño)
router.delete('/:id', validarJwt, eliminarComplejo);


// Rutas de Administrador
// Lo ideal es usar PATCH porque solo se actualiza un campo específico (el estado)
router.patch('/:id/estado', validarJwt, /* esAdmin, */ actualizarEstado);

export default router