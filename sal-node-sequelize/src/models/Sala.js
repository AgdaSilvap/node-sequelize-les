// Sofia: Cadastro de Sala de Leitura
import { Model, DataTypes } from 'sequelize';

export default class Sala extends Model {
  static init(sequelize) {
    super.init({
      qtCapacidade: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'A capacidade da sala deve ser preenchida!' },
        }
      },
      dsApelido: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O nome da sala deve ser preenchido!' },
        }
      },
      refrigerado: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: { msg: 'Selecione se a sala é refrigerada ou não.' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

    }, {
      sequelize, modelName: 'sala', tableName: 'salas'
    })
  }
  static associate(models) {
  }
}

export { Sala }