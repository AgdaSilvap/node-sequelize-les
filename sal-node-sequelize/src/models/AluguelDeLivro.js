import { Model, DataTypes } from 'sequelize';

export default class AluguelDeLivro extends Model {
  static init(sequelize) {
    super.init({
      dtAluguel: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data do aluguel deve ser preenchida!' },
        }
      },
      dtDevolucao: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data de devolução deve ser preenchida!' },
        }
      },
      dsTipoAluguel: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'A tipo do aluguel deve ser preenchida!' },
        }
      },
      vlTotal: {
        type: DataTypes.DOUBLE,
        validate: {
          notEmpty: { msg: 'O valor total deve ser preenchido!' },
          isFloat: { msg: 'O valor total deve ser um número válido!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize, modelName: 'aluguelDeLivro', tableName: 'aluguelDeLivros'
    })
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'id_cliente', onDelete: 'CASCADE' });
    this.belongsTo(models.Livro, { as: 'livro', foreignKey: 'id_livro', onDelete: 'CASCADE' });
  }
}

export { AluguelDeLivro }
