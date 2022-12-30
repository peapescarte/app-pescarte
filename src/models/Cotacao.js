import Sequelize, { Model } from "sequelize";

export default class Cotacao extends Model {

    static init(sequelize) {
        super.init({
            data: {
                type: Sequelize.DATE,
                primarykey: true
            },
            link: Sequelize.STRING(1000),
            fonte: {
                type: Sequelize.STRING(100),
                primaryKey: true
            }
            
        }, 
        {
            sequelize,
            modelName: 'Cotacao',
            tableName: 'cotacoes',
            createdAt: false,
            updatedAt: false,
            underscored: true
        });
        Cotacao.removeAttribute('id');

        return this;
    }

}