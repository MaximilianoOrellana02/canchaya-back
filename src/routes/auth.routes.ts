import { Router } from 'express'

import { login, register } from '../controllers/auth.controller'

const router = Router();


//Login
router.post('/login', login)

//Registro
router.post('/registro', register)

export default router