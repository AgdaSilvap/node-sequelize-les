import { AluguelDeLivro } from "../models/AluguelDeLivro.js";

import sequelize from "../config/database-connection.js";

class AluguelDeLivroService {
  static async findAll() {
    const objs = await AluguelDeLivro.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }
  static async findByPk(req) {
    const { id } = req.params;
    const obj = await AluguelDeLivro.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }


  static async create(req) {
      const { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal } = req.body;
      const obj = await AluguelDeLivro.create({ dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal });
      return await AluguelDeLivro.findByPk(obj.id, { include: { all: true, nested: true } });
    }
  
    static async update(req) {
      const { id } = req.params;
      const { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal } = req.body;
      const obj = await AluguelDeLivro.findByPk(id, { include: { all: true, nested: true } });
      if (obj == null) throw 'Aluguel não encontrado!';
      Object.assign(obj, { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal });
      return await obj.save();
    }
  
    static async delete(req) {
      const { id } = req.params;
      const obj = await AluguelDeLivro.findByPk(id);
      if (obj == null) throw 'Aluguel não encontrado!';
      await obj.destroy();
      return obj;
  
    }
}

export { AluguelDeLivroService };
