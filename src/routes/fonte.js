import { Router } from "express";
import fonte from "../controllers/FonteController";

const router = new Router();

router.get('/', fonte.index)

export default router;