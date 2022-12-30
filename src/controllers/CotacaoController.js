import Cotacao from '../models/Cotacao'

class CotacaoController{

    async index(req, res){

        const cot = await Cotacao.findAll();

        res.status(200).json(cot);
    }

}

export default new CotacaoController(); 