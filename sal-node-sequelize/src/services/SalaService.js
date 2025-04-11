//Sofia
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

  static async create(req) {}

  static async update(req) {}

  static async delete(req) {}
}

export { SalaService };
