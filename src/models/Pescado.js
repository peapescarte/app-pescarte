import Sequelize, { Model } from "sequelize";
import CotPescado from "./CotPescado";

export default class Pescado extends Model {

    static init(sequelize) {
        super.init({

            cod_pescado: {
                type: Sequelize.STRING(4),
                primaryKey: true
            },
            descricao: Sequelize.STRING(100),
            embalagem: Sequelize.STRING
            
        }, 
        {
            sequelize,
            modelName: 'Pescado',
            tableName: 'pescados',
            createdAt: false,
            updatedAt: false,
            underscored: true
        });
        Pescado.removeAttribute('id');

        return this;
    }

}