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
    const { dsTitulo, dtPublicacao, isbn, dsGenero, nrPaginas, dsTipo, dtCarga } = req.body;
    if (cidade == null) throw 'A Cidade do Bairro deve ser preenchida!';
    const obj = await Bairro.create({ nome, cidadeId: cidade.id });
    return await Bairro.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {}

  static async delete(req) {}
}

export { LivroService };
