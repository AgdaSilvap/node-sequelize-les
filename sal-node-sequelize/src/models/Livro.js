// Sofia: Cadastro de Livro
import { Model, DataTypes } from 'sequelize';

export default class Livro extends Model {
  static init(sequelize) {
    super.init({
      dsTitulo: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O título do livro deve ser preenchido!' },
          len: { args: [3, 50], msg: 'O título deve ter entre 3 e 50 caracteres!' },
        }
      },
      dtPublicacao: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'A data de publicação deve ser preenchida!' },
        }
      },
      isbn: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O ISBN deve ser preenchido!' },
        }
      },
      dsGenero: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O gênero deve ser selecionado!' },
        }
      },
      nrPaginas: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'O número de páginas deve ser preenchido!' },
        }
      },
      dsTipo: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'O tipo do livro deve ser selecionado!' },
        }
      },
      dtCarga: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize, modelName: 'livro', tableName: 'livros'
    })
  }

  static associate(models) {
    this.belongsTo(models.editora, { as: 'editora', foreignKey: 'editoraId', onDelete: 'CASCADE' });
    this.belongsTo(models.autor, { as: 'autor', foreignKey: 'autorId', onDelete: 'CASCADE' });
  }
}

export { Livro }