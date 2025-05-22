import { Model, DataTypes } from 'sequelize';

export default class Cliente extends Model {
  static init(sequelize) {
    super.init({
      dsNome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O nome deve ser preenchido!' },
          len: { args: [3, 50], msg: 'O nome deve ter entre 3 e 50 caracteres!' },
        }
      },
      dsCpf: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "CPF do Cliente deve ser preenchido!" },
          is: { args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Cliente deve seguir o padrão NNN.NNN.NNN-NN!" },
        }
      },
      dtNascimento: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data de nascimento deve ser preenchida!' },
        }
      },
      dsGenero: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "O gênero deve ser selecionado!" },
        }
      },
      dsTelefone: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O telefone deve ser preenchido!' },
        }
      },
      dsEndereco: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O endereço deve ser preenchido!' },
          len: { args: [3, 50], msg: 'O nome deve ter entre 3 e 50 caracteres!' },
        }
      },
      dtCadastro: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data de cadastro deve ser preenchida!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize, modelName: 'cliente', tableName: 'clientes'
    })
  }
  static associate(models) {
  }

}

export { Cliente }