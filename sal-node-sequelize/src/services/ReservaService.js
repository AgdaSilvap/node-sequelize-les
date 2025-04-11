//Sofia
import { Reserva } from "../models/Reserva.js";

import sequelize from "../config/database-connection.js";

class ReservaService {
  static async findAll() {
    const objs = await Reserva.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {}

  static async update(req) {}

  static async delete(req) {}
}

export { ReservaService };
