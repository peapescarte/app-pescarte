import dotenv from 'dotenv';

dotenv.config();

import './src/database'

import express from 'express';
import home from './src/routes/home';
import cotacao from './src/routes/cotacao';
import pescado from './src/routes/pescado'
import cotPesc from './src/routes/cotPescado'
import fonte from './src/routes/fonte'

class App{
    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended : true}));
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/', home);
        this.app.use('/cotacoes', cotacao);
        this.app.use('/pescados', pescado)
        this.app.use('/cotPescados', cotPesc);
        this.app.use('/fontes', fonte);
    }
}

export default new App().app;