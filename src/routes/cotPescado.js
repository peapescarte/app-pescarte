import { Router } from "express";
import cotPescado from '../controllers/CotPescadoController'

const router = new Router();

router.get('/', cotPescado.index);
router.get('/busca', cotPescado.busca);
router.get('/date', cotPescado.date);
router.get('/precos', cotPescado.precos);
router.get('/pescados', cotPescado.pescados);

export default router;