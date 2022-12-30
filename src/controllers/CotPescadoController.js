import CotPescado from "../models/CotPescado";

class CotPescadoController{

    async index(req, res){

        const cotPesc = await CotPescado.findAll();

        res.status(200).json(cotPesc);
    }

}

export default new CotPescadoController(); 