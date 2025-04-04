import { Model, DataTypes } from "sequelize"

class Feedback extends Model {
  static init(sequelize) {
    super.init({
      experiencia: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'A experiência deve ser descrita!'
          },
          len: {
            args: [3, 255],
            msg: 'A experiência deve ter entre 3 e 255 caracteres!'
          }
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      avaliacao: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: {
            msg: 'A avaliação deve ser selecionada!'
          }
        }
      },
      quantidadePessoas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A quantidade de pessoas deve ser selecionada!'
          },
          isInt: {
            msg: 'A quantidade de pessoas deve ser um número inteiro!'
          }
        }
      }
    }, {
      sequelize, modelName: 'feedback', tableName: 'feedbacks'
    })
  }

  static associate(models) {
    this.belongsTo(models.cliente, { as: 'cliente', foreignKey: 'id_cliente', allowNull: false, validate: { notNull: { msg: 'Cliente do Empréstimo deve ser preenchido!' } } });
    this.hasMany(models.reserva, { as: 'reserva', foreignKey: 'id_reserva_sala', allowNull: false, validate: { notNull: { msg: 'A  reserva deve ser informada!' } }, onDelete: 'CASCADE' });
  }
}

export { Feedback }
