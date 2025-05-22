import { Reserva } from "../models/Reserva.js";
import { Sala } from "../models/Sala.js";
import sequelize from "../config/database-connection.js";
import { Op } from "sequelize";

class ReservaService {
  static async findAll() {
    return await Reserva.findAll({
      include: { all: true, nested: true },
    });
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Reserva.findByPk(id, {
      include: { all: true, nested: true },
    });
  }

  static async create(req) {
    const {
      dtReserva,
      dtInicio,
      dtTermino,
      clienteId,
      funcionarioId,
      salaId,
      qtPessoas,
    } = req.body;

    this.verificaCamposObrigatorios({ clienteId, funcionarioId, salaId });

    await this.verificaRegrasDeNegocio({
      dtReserva,
      dtInicio,
      dtTermino,
      clienteId,
      salaId,
      qtPessoas,
    });

    const t = await sequelize.transaction();

    try {
      const obj = await Reserva.create(
        {
          dtReserva,
          dtInicio,
          dtTermino,
          clienteId,
          funcionarioId,
          salaId,
          qtPessoas,
        },
        { transaction: t }
      );

      await t.commit();

      return await Reserva.findByPk(obj.id, {
        include: { all: true, nested: true },
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
      qtPessoas,
    } = req.body;

    const t = await sequelize.transaction();

    try {
      const obj = await Reserva.findByPk(id, { transaction: t });
      if (!obj) throw new Error("Reserva não encontrada!");

      this.verificaCamposObrigatorios({ clienteId, funcionarioId, salaId });

      await this.verificaRegrasDeNegocio(
        {
          dtReserva,
          dtInicio,
          dtTermino,
          clienteId,
          salaId,
          qtPessoas,
        },
        id
      );

      Object.assign(obj, {
        dtReserva,
        dtInicio,
        dtTermino,
        clienteId,
        funcionarioId,
        salaId,
        qtPessoas,
      });

      await obj.save({ transaction: t });

      await t.commit();

      return await Reserva.findByPk(obj.id, {
        include: { all: true, nested: true },
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async delete(req) {
    const { id } = req.params;

    const t = await sequelize.transaction();

    try {
      const deletado = await Reserva.destroy(
        { where: { id }, transaction: t }
      );

      await t.commit();

      return deletado;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static verificaCamposObrigatorios({ clienteId, funcionarioId, salaId }) {
    if (!clienteId) throw new Error("O cliente deve ser preenchido!");
    if (!funcionarioId) throw new Error("O funcionário deve ser preenchido!");
    if (!salaId) throw new Error("A sala deve ser preenchida!");
  }

  static async verificaRegrasDeNegocio(
    { dtReserva, dtInicio, dtTermino, clienteId, salaId, qtPessoas },
    reservaId = null
  ) {
    const inicio = new Date(dtInicio);
    const termino = new Date(dtTermino);

    if (inicio >= termino) {
      throw new Error("A data/hora de início deve ser anterior à data/hora de término.");
    }

    // Regra de Negócio 1: A sala deve estar disponível.
    const conflitoWhere = {
      salaId,
      [Op.or]: [
        {
          dtInicio: {
            [Op.between]: [dtInicio, dtTermino],
          },
        },
        {
          dtTermino: {
            [Op.between]: [dtInicio, dtTermino],
          },
        },
        {
          [Op.and]: [
            { dtInicio: { [Op.lte]: dtInicio } },
            { dtTermino: { [Op.gte]: dtTermino } },
          ],
        },
      ],
      ...(reservaId && { id: { [Op.ne]: reservaId } }),
    };

    const reservasConflitantes = await Reserva.findAll({
      where: conflitoWhere,
    });

    if (reservasConflitantes.length > 0) {
      throw new Error("A sala já está reservada neste horário!");
    }

    // Regra de Negócio 2: Cliente pode ter no máximo 2 reservas no mesmo dia.
    const reservasCliente = await Reserva.findAll({
      where: {
        clienteId,
        dtReserva: {
          [Op.between]: [
            new Date(new Date(dtReserva).setHours(0, 0, 0, 0)),
            new Date(new Date(dtReserva).setHours(23, 59, 59, 999)),
          ],
        },
        ...(reservaId && { id: { [Op.ne]: reservaId } }),
      },
    });

    if (reservasCliente.length >= 2) {
      throw new Error("O cliente já possui duas reservas para este dia!");
    }
  }
}

export { ReservaService };