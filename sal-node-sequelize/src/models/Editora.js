import { Model, DataTypes } from "sequelize";

class Editora extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O nome da editora deve ser preenchido!' },
          len: { args: [3, 50], msg: 'O nome deve ter entre 3 e 50 caracteres!' },
        }
      },
      cnpj: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O CNPJ deve ser preenchido!' },
          len: { args: [14, 18], msg: 'O CNPJ deve ter entre 14 e 18 caracteres!' },
        }
      },
      edereco: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O endereço deve ser preenchido!' },
          len: { args: [5, 50], msg: 'O endereço deve ter entre 5 e 50 caracteres!' },
        }
      },
      telefone: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O telefone deve ser preenchido!' },
          //quantidade de caracteres contada incluindo o DDD com ou sem '0' para celular ou fixo
          len: { args: [10, 17], msg: 'O telefone está incorreto!' },
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O email deve ser preenchido!' },
          len: { args: [10, 50], msg: 'O email deve ter entre 10 e 50 caracteres!' },
        }
      },
      website: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O website deve ser preenchido!' },
          len: { args: [7, 50], msg: 'O website deve ter entre 7 e 50 caracteres!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    }, {
      sequelize, modelName: 'editora', tableName: 'editoras'
    })
  }
  static associate(models) {
  }

}

export { Editora }