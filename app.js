import dotenv from 'dotenv';

dotenv.config();

import './src/database'

import express from 'express';
import cors from 'cors';
import home from './src/routes/home';
import cotacao from './src/routes/cotacao';
import pescado from './src/routes/pescado';
import cotPesc from './src/routes/cotPescado';
import fonte from './src/routes/fonte';
import auth from './src/routes/auth';
import authorization from './src/middlewares/authentication';
import datafonte from './src/routes/datafonte';

class App{
    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended : true}));
        this.app.use(express.json());
        this.app.use(express.static('public'));
        // this.app.use(cors({origin: 'https://pescarte.onrender.com'}));
    }

    routes(){
        this.app.use('/', home);
        this.app.use('/cotacoes', authorization, cotacao);
        this.app.use('/pescados', authorization, pescado)
        this.app.use('/cotPescados', authorization, cotPesc);
        this.app.use('/fontes', authorization, fonte);
        this.app.use('/auth', auth);
        this.app.use('/datafonte', authorization, datafonte);
    }
}

export default new App().app;