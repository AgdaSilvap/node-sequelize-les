import { Model, DataTypes } from 'sequelize';

export default class Funcionario extends Model {
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
          notEmpty: { msg: "CPF do Funcionario deve ser preenchido!" },
          is: {args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Funcionario deve seguir o padrão NNN.NNN.NNN-NN!" },
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
      status: { 
        type: DataTypes.BOOLEAN, 
        validate: {
          notEmpty: { msg: "Informação sobre status do Funcionario!" } // 0: desligado 1: ativo
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize, modelName: 'funcionario', tableName: 'funcionarios'
    })
  }

  static associate(models) {
  }
}

export { Funcionario }