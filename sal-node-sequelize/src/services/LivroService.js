import { Livro } from "../models/Livro.js";
import sequelize from "../config/database-connection.js";

class LivroService {
  static async findAll() {
    const objs = await Livro.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Livro.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {
    const {
      dsTitulo,
      dtPublicacao,
      isbn,
      dsGenero,
      nrPaginas,
      dsTipo,
      autorId,
      editoraId,
    } = req.body;

    if (!editoraId) throw "A editora do livro deve ser preenchida!";
    if (!autorId) throw "O autor do livro deve ser preenchido!";

    const t = await sequelize.transaction();

    try {
      const obj = await Livro.create(
        {
          dsTitulo,
          dtPublicacao,
          isbn,
          dsGenero,
          nrPaginas,
          dsTipo,
          autorId,
          editoraId,
        },
        { transaction: t }
      );

      await t.commit();

      const livroCriado = await Livro.findByPk(obj.id, {
        include: { all: true, nested: true },
      });

      console.log("Livro criado com sucesso:", livroCriado);
      return livroCriado;

    } catch (err) {
      await t.rollback();
      console.error("Erro ao criar livro:", err);
      throw "Erro ao criar o livro. Verifique os dados e tente novamente.";
    }
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dsTitulo,
      dtPublicacao,
      isbn,
      dsGenero,
      nrPaginas,
      dsTipo,
      autorId,
      editoraId,
    } = req.body;

    if (!editoraId) throw "A editora deve ser preenchida!";
    if (!autorId) throw "O autor do livro deve ser preenchido!";

    const obj = await Livro.findByPk(id, {
      include: { all: true, nested: true },
    });

    if (!obj) throw "Livro não encontrado!";

    Object.assign(obj, {
      dsTitulo,
      dtPublicacao,
      isbn,
      dsGenero,
      nrPaginas,
      dsTipo,
      autorId,
      editoraId,
    });

    await obj.save();

    return await Livro.findByPk(obj.id, {
      include: { all: true, nested: true },
    });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Livro.findByPk(id);
    if (!obj) throw "Livro não encontrado!";

    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      throw "Não é possível remover o livro.";
    }
  }
}

export { LivroService };