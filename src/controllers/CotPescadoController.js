import { Op } from "sequelize";
import CotPescado from "../models/CotPescado";
import Sequelize from "sequelize";
import Pescado from "../models/Pescado";
const jwt = require('jsonwebtoken');

class CotPescadoController{

    async index(req, res){

        const cotPesc = await CotPescado.findAll({
            order: [['data', 'DESC']],
        });

        res.status(200).json(cotPesc);
    }

    async busca(req, res){
        
        let where = {};

        if(req.body.fonte || req.body.inicio || req.body.fim){
            where[Op.and] = [];

            if(req.body.fonte){
                where[Op.and].push({
                    fonte: req.body.fonte
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
            order: [['data', 'DESC']],
            include: [
              {
                model: Pescado,
                attributes: ['descricao'],
              }
            ],
            attributes: ['cod_pescado', 'fonte', 'data']
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

    async precos(req, res){

        let where = {}

        if(req.body.fonte || req.body.pescado || req.body.inicio || req.body.fim){
            where[Op.and] = [];

            if(req.body.fonte){
                where[Op.and].push({
                    fonte: req.body.fonte
                });
            }

            if(req.body.pescado){
                where[Op.and].push({
                    '$Pescado.descricao$': req.body.pescado
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
            order: [['data', 'DESC']],
            include: [
              {
                model: Pescado,
                attributes: ['descricao'],
              }
            ],
            attributes: ['minimo', 'maximo', 'mais_comum']
          });

          const agrupado = cotPesc.reduce((acc, cot) => {
            const nome = cot.Pescado.descricao;
            if (!acc[nome]) {
              acc[nome] = {
                nome,
                minimo: [],
                maximo: [],
                mais_comum: []
              };
            }
            acc[nome].minimo.push(cot.minimo);
            acc[nome].maximo.push(cot.maximo);
            acc[nome].mais_comum.push(cot.mais_comum);
            return acc;
          }, {});
          
          // Converte o objeto de grupos para um array de objetos
          const resultado = Object.values(agrupado);


          res.status(200).json(resultado);

    }
    

}



export default new CotPescadoController(); 