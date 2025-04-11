//Sofia
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
    const { dsTitulo, dtPublicacao, isbn, dsGenero, nrPaginas, dsTipo, dtCarga, autor, editora } = req.body; //autor e editora são associações com outras tabelas
    if (editora == null) throw 'A editora do livro deve ser preenchido!'; //autor e editora são foreign keys
    if (autor == null) throw 'O autor do livro deve ser preenchido!';
    const obj = await Bairro.create({ dsTitulo, dtPublicacao, isbn, dsGenero, nrPaginas, dsTipo, dtCarga, autorId: autor.id, editoraId: editora.id }); //como autor e editora são foreign keys, a referência fica da forma que coloquei
    return await Bairro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { dsTitulo, dtPublicacao, isbn, dsGenero, nrPaginas, dsTipo, dtCarga, autor, editora } = req.body;
    if (editora == null) throw 'A editora deve ser preenchida!';
    if (autor == null) throw 'O autor do livro deve ser preenchido!';
    const obj = await Livro.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Livro não encontrado!';
    Object.assign(obj, { dsTitulo, dtPublicacao, isbn, dsGenero, nrPaginas, dsTipo, dtCarga, autorId: autor.id, editoraId: editora.id });
    await obj.save();
    return await Livro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {}
}

export { LivroService };
