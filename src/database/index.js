import { Sequelize } from "sequelize";
import databaseConfig from '../config/database';
import Cotacao from '../models/Cotacao';
import Pescado from "../models/Pescado";
import CotPescado from "../models/CotPescado";
import Fonte from "../models/Fonte";

const models = [Fonte, Cotacao, Pescado, CotPescado];

const connection = new Sequelize(databaseConfig);

models.forEach( (model) => model.init(connection) );