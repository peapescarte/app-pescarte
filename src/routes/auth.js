const express = require('express');
const jwt = require('jsonwebtoken');
import { Router } from "express";
import auth from "../controllers/AuthController";

const router = new Router();

router.get('/', auth.index)

export default router;