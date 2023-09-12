import CotPescado from '../models/CotPescado';
import Fonte from '../models/Fonte';
const axios = require('axios');

class FonteController{

    async index(req, res){

        const date = await CotPescado.findAll({
            order: [['data', 'DESC']],
            attributes: ['data'],
            limit: 1
        })

        const fontes = await Fonte.findAll({
            order: [['nome', 'DESC']]
        });

        const nomeFontes = fontes.map(fonte => fonte.nome)

        res.status(200).json({'data': date[0], 'fontes':nomeFontes});

    }

}

export default new FonteController(); 