import { Sala } from "../models/Sala.js";
import sequelize from "../config/database-connection.js";

class SalaService {
  static async findAll() {
    const objs = await Sala.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Sala.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {
    const { qtCapacidade, dsApelido, refrigerado } = req.body;
    if (!dsApelido) throw "O apelido da sala é obrigatório!";
    const obj = await Sala.create({
      qtCapacidade,
      dsApelido,
      refrigerado,
    });
    return await Sala.findByPk(obj.id, {
      include: { all: true, nested: true },
    });
  }

  static async update(req) {
    const { id } = req.params;
    const { qtCapacidade, dsApelido, refrigerado } = req.body;

    // Validação: Verifica se o apelido da sala foi fornecido
    if (!dsApelido) throw "O apelido da sala é obrigatório!";

    const obj = await Sala.findByPk(id, {
      include: { all: true, nested: true },
    });
    if (obj == null) throw "Sala não encontrada!";

    Object.assign(obj, {
      qtCapacidade,
      dsApelido,
      refrigerado,
    });

    await obj.save();
    return await Sala.findByPk(obj.id, {
      include: { all: true, nested: true },
    });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Sala.findByPk(id);
    if (obj == null) throw "Sala não encontrada!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover a sala.";
    }
  }
}

export { SalaService };