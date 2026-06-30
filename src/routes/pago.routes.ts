import { Router } from 'express'
import {
    crearPreferencia,
    recibirWebhook
} from '../controllers/pago.controller'

const router = Router();

//El front llama a esta ruta para pedir el boton de pago
router.post('/crear-preferencia', crearPreferencia);

//MP llama a esta ruta em segundo plano para avisar que entro en la ruta
router.post('/webhook', recibirWebhook)

export default router