import { Reserva } from "../models/Reserva.js";
import { Sala } from "../models/Sala.js";
import { Cliente } from "../models/Cliente.js";
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
      const deletado = await Reserva.destroy({ where: { id }, transaction: t });

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

    // Regra 1: Verificar conflito de horários da sala
    const conflitoWhere = {
      salaId,
      [Op.or]: [
        { dtInicio: { [Op.between]: [dtInicio, dtTermino] } },
        { dtTermino: { [Op.between]: [dtInicio, dtTermino] } },
        {
          [Op.and]: [
            { dtInicio: { [Op.lte]: dtInicio } },
            { dtTermino: { [Op.gte]: dtTermino } },
          ],
        },
      ],
      ...(reservaId && { id: { [Op.ne]: reservaId } }),
    };

    const reservasConflitantes = await Reserva.findAll({ where: conflitoWhere });

    if (reservasConflitantes.length > 0) {
      throw new Error("A sala já está reservada neste horário!");
    }

    // Regra 2: Cliente pode ter no máximo 2 reservas no mesmo dia (baseado em dtInicio)
    const inicioDia = new Date(inicio);
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date(inicio);
    fimDia.setHours(23, 59, 59, 999);

    const reservasClienteDia = await Reserva.findAll({
      where: {
        clienteId,
        dtInicio: {
          [Op.between]: [inicioDia, fimDia],
        },
        ...(reservaId && { id: { [Op.ne]: reservaId } }),
      },
    });

    if (reservasClienteDia.length >= 2) {
      throw new Error("O cliente já possui duas reservas para este dia!");
    }

    // Regra 3: Clientes com menos de 30 anos só podem fazer 1 reserva por mês
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) throw new Error("Cliente não encontrado!");

    const calcularIdade = (dataNascimento) => {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    };

    const idadeCliente = calcularIdade(cliente.dtNascimento);

    const inicioMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
    const fimMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0, 23, 59, 59, 999);

    const reservasNoMes = await Reserva.findAll({
      where: {
        clienteId,
        dtInicio: {
          [Op.between]: [inicioMes, fimMes],
        },
        ...(reservaId && { id: { [Op.ne]: reservaId } }),
      },
    });

    if (idadeCliente < 30 && reservasNoMes.length >= 1) {
      throw new Error("Clientes com menos de 30 anos só podem fazer 1 reserva por mês.");
    }
  }

  // Método adicional para listar reservas de um cliente
  static listarReservasPorCliente(clienteId) {
    return Reserva.findAll({
      where: { clienteId },
      include: { all: true, nested: true },
    });
  }

  // Listar a capacidade total de salas que são refrigeradas (lista as salas que são refrigeradas e a capacidade delas (1 - refrigerada e 0 - não refrigerada))
static async listarCapacidadeSalasRefrigeradas() {
  const salas = await Sala.findAll({
    where: { refrigerado: true },
    attributes: ['id', 'ds_apelido', 'qt_capacidade', 'refrigerado'],
  });
  return salas;
}

  // Listar total de reservas por data (filtrando pela data, mostra as salas cadastradas e quantas reservas essas salas tiveram na data selecionada)
static async listarReservasPorData(data) {
  
}

}

export { ReservaService };
