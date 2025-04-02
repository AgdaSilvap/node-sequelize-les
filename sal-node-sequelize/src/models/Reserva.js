// // Sofia: Processo de Reserva de Sala
import { Model, DataTypes } from 'sequelize';

export default class Reserva extends Model {
  static init(sequelize) {
    super.init({
      dtReserva: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'O data da reserva deve ser selecionada!' },
        }
      },
      dtInicio: {
        type: DataTypes.DATETIME,
        validate: {
          notEmpty: { msg: 'A data de início deve ser selecionada!' },
        }
      },
      dtTermino: {
        type: DataTypes.DATETIME,
        validate: {
          notEmpty: { msg: 'A data de término deve ser selecionada!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
      {
        sequelize, modelName: 'reserva', tableName: 'reservas'
      })
  }

  static associate(models) {
    this.belongsTo(models.cliente, { as: 'cliente', foreignKey: 'clienteId', onDelete: 'CASCADE' });
    this.belongsTo(models.funcionario, { as: 'funcionario', foreignKey: 'funcionarioId', onDelete: 'CASCADE' });
    this.belongsTo(models.sala, { as: 'sala', foreignKey: 'salaId', onDelete: 'CASCADE' });
    this.hasOne(models.feedback, { as: 'feedback', foreignKey: 'feedbackId', onDelete: 'CASCADE' });
  }
}

export { Reserva }