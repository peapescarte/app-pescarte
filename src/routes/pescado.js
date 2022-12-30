import { Router } from "express";
import pescado from '../controllers/PescadoController'

const router = new Router();

router.get('/', pescado.index)

export default router;