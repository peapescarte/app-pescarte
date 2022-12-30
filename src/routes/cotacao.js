import { Router } from "express";
import cotacao from '../controllers/CotacaoController'

const router = new Router();

router.get('/', cotacao.index)

export default router;