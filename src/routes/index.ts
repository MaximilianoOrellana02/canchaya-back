import { Router } from "express";

import authRoutes from './auth.routes'
import usuarioRoutes from './usuario.routes'
import complejoRoutes from './complejo.routes'
import canchasRoutes from './cancha.routes'
import reservasRoutes from './reserva.routes'
import pagoRoutes from './pago.routes'
import valoracionRoutes from './valoraciones.routes'

const router = Router()

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/complejos', complejoRoutes);
router.use('/canchas', canchasRoutes);
router.use('/reservas', reservasRoutes);
router.use('/pagos', pagoRoutes);
router.use('/valoraciones', valoracionRoutes)

export default router;