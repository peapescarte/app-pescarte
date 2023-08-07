import { Op } from "sequelize";
import CotPescado from "../models/CotPescado";
import Sequelize from "sequelize";
import Pescado from "../models/Pescado";
const jwt = require('jsonwebtoken');
const url = require('url');

class CotPescadoController{

    async index(req, res){

        const cotPesc = await CotPescado.findAll({
            order: [['data', 'DESC']],
        });

        res.status(200).json(cotPesc);
    }

    async busca(req, res){
        
        let where = {};

        if(req.query.fonte || req.query.inicio || req.query.fim){
            where[Op.and] = [];

            if(req.query.fonte){
                where[Op.and].push({
                    fonte: req.query.fonte
                });
            }

            if(req.query.inicio && req.query.fim){
                where[Op.and].push({
                    data: {
                        [Op.between]: [req.query.inicio, req.query.fim]
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

        const date = await CotPescado.findAll({
            order: [['data', 'DESC']],
            attributes: ['data'],
            limit: 1
        })

        res.status(200).json(date[0]);

    }}

    async precos(req, res){

        let where = {}

        if(req.query.fonte || req.query.pescado || req.query.inicio || req.query.fim){
            where[Op.and] = [];

            if(req.query.fonte){
                where[Op.and].push({
                    fonte: req.query.fonte
                });
            }

            if(req.query.pescado){
                where[Op.and].push({
                    '$Pescado.cod_pescado$': req.query.pescado
                });
            }

            if(req.query.inicio && req.query.fim){
                where[Op.and].push({
                    data: {
                        [Op.between]: [req.query.inicio, req.query.fim]
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
            acc[nome].minimo.push(parseFloat(cot.minimo));
            acc[nome].maximo.push(parseFloat(cot.maximo));
            acc[nome].mais_comum.push(parseFloat(cot.mais_comum));
            return acc;
          }, {});

          Object.values(agrupado).forEach((pescado) => {
            const calcularMedia = (array) => array.reduce((acc, val) => acc + val, 0) / array.length;
            pescado.minimo = calcularMedia(pescado.minimo).toFixed(2);
            pescado.maximo = calcularMedia(pescado.maximo).toFixed(2);
            pescado.mais_comum = calcularMedia(pescado.mais_comum).toFixed(2);
          });
          
          const resultado = Object.values(agrupado);


          res.status(200).json(resultado);

    }

    async pescados(req, res) {

        let where = {}

        where[Op.and] = [];

        if(req.query.fonte){
            where[Op.and].push({
                fonte: req.query.fonte
            });
        }
    
        if (req.query.data) {

            where[Op.and].push({
                fonte: req.query.data
            });
    
            const query = await CotPescado.findAll({
                where: where,
                attributes: [],
                include: [
                    {
                        model: Pescado,
                        attributes: ['descricao', 'cod_pescado'],
                    }
                ],
                raw: true,
                distinct: true
            });
    
            res.status(200).json(query.map(item => ({ 'nome': item['Pescado.descricao'], 'cod': item["Pescado.cod_pescado"] })));
        }
    
        if (req.query.inicio && req.query.fim) {
            
            where[Op.and].push({
                data: {
                    [Op.between]: [req.query.inicio, req.query.fim]
                }
            });
    
            const query = await CotPescado.findAll({
                where: where,
                attributes: [],
                include: [
                    {
                        model: Pescado,
                        attributes: ['descricao', 'cod_pescado'],
                    }
                ],
                raw: true,
                distinct: true
            });
    
            res.status(200).json(query.map(item => ({ 'nome': item['Pescado.descricao'], 'cod': item["Pescado.cod_pescado"] })))
        }
    }
    

}



export default new CotPescadoController(); 