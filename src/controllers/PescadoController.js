import Pescado from '../models/Pescado'

class PescadoController{

    async index(req, res){

        const pesc = await Pescado.findAll();

        res.status(200).json(pesc);
    }

}

export default new PescadoController(); 