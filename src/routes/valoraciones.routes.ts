import { Router } from "express";
import {
    crearValoracion,
    getValoracionesComplejo
} from '../controllers/valoraciones.controller'
import { validarJwt } from "../middlewares/validar-jwt";

const router = Router();

//Ruta Publica
router.get('/:complejo_id', getValoracionesComplejo);

//Ruta Pivada
router.post('/', validarJwt, crearValoracion)

export default router