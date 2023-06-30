import { Router } from "express";
import dataFonte from "../controllers/DataFonteController";

const router = new Router();

router.get('/', dataFonte.index); 

export default router;