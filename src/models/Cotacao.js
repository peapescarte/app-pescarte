import Sequelize, { Model } from "sequelize";
import Fonte from './Fonte';

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
                primaryKey: true,
                references: 'fontes_de_cotacoes',
                referencesKey: 'nomefonte' 
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