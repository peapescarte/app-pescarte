import { Op } from "sequelize";
import CotPescado from "../models/CotPescado";

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

        const cotPesc = await CotPescado.findAll({ where });

        res.status(200).json(cotPesc);

    }

}

export default new CotPescadoController(); 