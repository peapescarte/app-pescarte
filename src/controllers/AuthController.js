const jwt = require('jsonwebtoken');

class AuthController{

    async index(req, res){

        const KEY = 'pescarte';
        const token = jwt.sign({}, KEY);

        res.status(200).json(token);
        
    }

}

export default new AuthController();