import { Router } from 'express'

import {
    getUsuarios,
    getUsuario,
    actualizarUsuario,
    cambiarRol
} from './../controllers/usuario.controller'

import { validarJwt } from '../middlewares/validar-jwt'
import { esAdminODuenio } from '../middlewares/validar-roles'

const router = Router()

router.get('/', validarJwt, esAdminODuenio, getUsuarios)
router.get('/:id', validarJwt, esAdminODuenio, getUsuario)
router.put('/perfil', validarJwt, actualizarUsuario)
router.patch('/:id/rol', validarJwt, esAdminODuenio, cambiarRol)

export default router