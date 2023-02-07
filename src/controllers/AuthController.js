const jwt = require('jsonwebtoken');

class AuthController{

    async index(req, res){

        const KEY = 'pescarte';
        const token = jwt.sign({}, KEY, {
            expiresIn: '1d',
        }); //TODO colocar key no env

        res.status(200).json(token);
        
    }

}

export default new AuthController();