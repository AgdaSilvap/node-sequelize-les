import { Cliente } from "../models/Cliente.js";

import sequelize from "../config/database-connection.js";

class ClienteService {
  static async findAll() {
    const objs = await Cliente.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }
  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }
  static async create(req) {}

  static async update(req) {}

  static async delete(req) {}
}

export { ClienteService };
