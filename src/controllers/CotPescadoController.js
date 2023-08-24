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

    async medias(req, res){
        const { codPescado, dataInicio, dataFim } = req.query;

        try {
            const queryResult = await CotPescado.findAll({
            where: {
                cod_pescado: codPescado,
                data: {
                [Op.between]: [dataInicio, dataFim],
                },
            },
            attributes: ['data', 'minimo', 'mais_comum', 'maximo'],
            });

            const monthlyAverages = {};
            queryResult.forEach(row => {
                const rowData = row.dataValues;
                const rowDate = new Date(rowData.data);
                const month = getMonthName(rowDate.getMonth()); // Obter o nome do mês

                if (!monthlyAverages[month]) {
                    monthlyAverages[month] = {
                    media_minimo: 0,
                    media_mais_comum: 0,
                    media_maximo: 0,
                    count: 0,
                    };
                }
                const currentMonth = monthlyAverages[month];
                currentMonth.media_minimo += parseFloat(rowData.minimo); // Converta para número
                currentMonth.media_mais_comum += parseFloat(rowData.mais_comum); // Converta para número
                currentMonth.media_maximo += parseFloat(rowData.maximo); // Converta para número
                currentMonth.count++;
            });

            Object.keys(monthlyAverages).forEach(month => {
                const monthData = monthlyAverages[month];
                monthData.media_minimo /= monthData.count;
                monthData.media_mais_comum /= monthData.count;
                monthData.media_maximo /= monthData.count;
                delete monthData.count;
            });

            res.status(200).json(monthlyAverages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao processar a solicitação.' });
        }
    }
    
}

function getMonthName(monthIndex) {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[monthIndex];
  }


export default new CotPescadoController(); 