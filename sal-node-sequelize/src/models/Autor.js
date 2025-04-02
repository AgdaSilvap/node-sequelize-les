import { Model, DataTypes } from 'sequelize';

export default class Autor extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O nome deve ser preenchido!' },
          len: { args: [3, 50], msg: 'O nome deve ter entre 3 e 50 caracteres!' },
        }
      },
      nascimento: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data de nascimento deve ser preenchida!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      nacionalidade: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'A nacionalidade deve ser preenchida!' },
          len: { args: [5, 30], msg: 'A nacionalidade deve ter entre 3 e 30 caracteres!' },
        }
      }
    }, {
      sequelize, modelName: 'autor', tableName: 'autores'
    })
  }

  static associate(models) {
    this.hasMany(models.livro, { as: 'livros', foreignKey: 'autorId', allowNull: false, onDelete: 'CASCADE' });
  }
}

export { Autor }