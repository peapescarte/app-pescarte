import { Op } from "sequelize";
import CotPescado from "../models/CotPescado";
import Sequelize from "sequelize";
import Pescado from "../models/Pescado";
const jwt = require('jsonwebtoken');

class CotPescadoController{

    async index(req, res){

        const cotPesc = await CotPescado.findAll();

        res.status(200).json(cotPesc);
    }

    async busca(req, res){
        
        const where = {};

        if(req.body.fonte || req.body.pescado || req.body.inicio || req.body.fim || req.body.precoMin || req.body.precoMax){
            where[Op.and] = [];

            if(req.body.fonte){
                where[Op.and].push({
                    fonte: req.body.fonte
                });
            }

            if(req.body.pescado){
                where[Op.and].push({
                    cod_pescado: req.body.pescado
                });
            }

            if(req.body.precoMin && req.body.precoMax){
                where[Op.and].push({
                    maximo: {
                        [Op.between]: [req.body.precoMin, req.body.precoMax]
                    }
                });
            }

            if(req.body.inicio && req.body.fim){
                where[Op.and].push({
                    data: {
                        [Op.between]: [req.body.inicio, req.body.fim]
                    }
                });
            }

        }

        const cotPesc = await CotPescado.findAll({
            where: where,
            include:{
                model: Pescado
            },
        });


        res.status(200).json(cotPesc);

    }

    async date(req, res){{

        // const token = req.headers.authorization;
        // if (!token) return res.status(401).send('Access Denied');

        const date = await CotPescado.findAll({
            order: [['data', 'DESC']],
            attributes: ['data'],
            limit: 1
        })

        res.status(200).json(date[0]);

    }}
    

}

export default new CotPescadoController(); 