import { Router } from "express";
import fonte from "../controllers/FonteController";

const router = new Router();

router.get('/', fonte.index); 
router.get('/busca', fonte.busca);

export default router;