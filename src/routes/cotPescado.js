import { Router } from "express";
import cotPescado from '../controllers/CotPescadoController'

const router = new Router();

router.get('/', cotPescado.index)

export default router;