import Sequelize, { Model } from "sequelize";

export default class Fonte extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                field: 'nomefonte',
                type: Sequelize.STRING(100),
                primaryKey: true
            },
            descricao: {
                field: 'descricaofonte',
                type: Sequelize.TEXT
            },
            link: {
                field: 'linkfonte',
                type: Sequelize.STRING(200)
            }
        }, 
        {
            sequelize,
            modelName: 'Fonte',
            tableName: 'fontes_de_cotacoes',
            createdAt: false,
            updatedAt: false,
            underscored: true
        });
        Fonte.removeAttribute('id');

        return this;
    }

}