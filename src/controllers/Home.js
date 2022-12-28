class Home{

    index(req, res){
        res.status(200).json({
            "msg" : "Bom dia 🙂"
        });
    }

}

export default new Home();