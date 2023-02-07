import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization){
        return res.status(401).send("Não autorizado");
    }

    const [bearer, token] = authorization.split(' ');

    try {
        const a = jwt.verify(token, 'pescarte'); //TODO Colocar no env
        return next();
    } catch (e) {
        console.log(e)
        console.log(token)
        return res.status(401).send("Token inválido")
    }


};