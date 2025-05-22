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

  static async create(req) {
    const {
      dtReserva,
      dtInicio,
      dtTermino,
      clienteId,
      funcionarioId,
      salaId,
    } = req.body;

    if (!clienteId) throw "O cliente deve ser preenchido!";
    if (!funcionarioId) throw "O funcionário deve ser preenchido!";
    if (!salaId) throw "A sala deve ser preenchida!";

    const t = await sequelize.transaction();
    const obj = await Reserva.create(
      {
        dtReserva,
        dtInicio,
        dtTermino,
        clienteId,
        funcionarioId,
        salaId,
      },
      { transaction: t }
    );

    await t.commit();

    return await Reserva.findByPk(obj.id, {
      include: { all: true, nested: true },
    });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      dtReserva,
      dtInicio,
      dtTermino,
      clienteId,
      funcionarioId,
      salaId,
    } = req.body;

    if (!clienteId) throw "O cliente deve ser preenchido!";
    if (!funcionarioId) throw "O funcionário deve ser preenchido!";
    if (!salaId) throw "A sala deve ser preenchida!";

    const obj = await Reserva.findByPk(id, {
      include: { all: true, nested: true },
    });

    if (!obj) throw "Reserva não encontrada!";

    Object.assign(obj, {
      dtReserva,
      dtInicio,
      dtTermino,
      clienteId,
      funcionarioId,
      salaId,
    });

    await obj.save();

    return await Reserva.findByPk(obj.id, {
      include: { all: true, nested: true },
    });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id);
    if (!obj) throw "Reserva não encontrada!";
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover a reserva.";
    }
  }

  //Método a ser utilizado no formulário de feedbacks - AGDA
  static listarReservasPorCliente(clienteId) {
    return Reserva.findAll({
      where: { clienteId },
      include: { all: true, nested: true },
    });
  }
}

export { ReservaService };