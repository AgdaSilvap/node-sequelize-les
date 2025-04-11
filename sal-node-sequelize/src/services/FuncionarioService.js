import { Funcionario } from "../models/Funcionario.js";

import sequelize from "../config/database-connection.js";

class FuncionarioService {
  static async findAll() {
    const objs = await Funcionario.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }
  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }
  static async create(req) {}

  static async update(req) {}

  static async delete(req) {}
}

export { FuncionarioService };
