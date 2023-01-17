const {resolve} = require ('path')

class HomeController{

    index(req, res){
        res.sendFile(resolve(__dirname, '..', '..', 'public', 'index.html'));
    }

}

export default new HomeController(); 