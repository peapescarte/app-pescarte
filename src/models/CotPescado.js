import Sequelize, { Model } from "sequelize";
import Cotacao from "./Cotacao";
import Pescado from "./Pescado";

export default class CotPescado extends Model {

    static init(sequelize) {
        super.init({
            cod_pescado: {
                type: Sequelize.STRING(4),
                primaryKey: true,
                references: 'pescados',
                referencesKey: 'cod_pescado'
            },
            data: {
                type: Sequelize.DATE,
                primaryKey: true,
                references: 'cotacoes',
                referencesKey: 'data'
            },
            fonte: {
                type: Sequelize.STRING(100),
                primaryKey: true
            },
            minimo: Sequelize.NUMBER,
            maximo: Sequelize.NUMBER
            
        }, 
        {
            sequelize,
            modelName: 'CotPescado',
            tableName: 'cotacoes_pescados',
            createdAt: false,
            updatedAt: false,
            underscored: true
        });
        CotPescado.removeAttribute('id');

        return this;
    }

}