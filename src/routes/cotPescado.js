import { Router } from "express";
import cotPescado from '../controllers/CotPescadoController'

const router = new Router();

router.get('/', cotPescado.index);
router.get('/busca', cotPescado.busca);

export default router;