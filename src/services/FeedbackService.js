import { Feedback } from "../models/Feedback.js";
import sequelize from "../config/database-connection.js";
import Reserva from "../models/Reserva.js";
import { Op, fn, col, literal } from "sequelize";

class FeedbackService {
  static async findAll() {
    const feedbacks = await Feedback.findAll({ include: { all: true, nested: true } });
    return feedbacks;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const feedback = await Feedback.findByPk(id, { include: { all: true, nested: true } });
    return feedback;
  }

  static async create(req) {
    const { reservaId, experiencia, avaliacao, quantidadePessoas } = req.body;
    if (await this.verificaCamposFormulario(req.body)) {

      if (await this.verificaRegrasDeNegocio(req)) {
        const transaction = await sequelize.transaction();
        const feedback = await Feedback.create({ reservaId: reservaId, experiencia, avaliacao, quantidadePessoas }, { transaction: transaction });

        try {
          await transaction.commit();
          return await Feedback.findByPk(feedback.id, { include: { all: true, nested: true } });
        } catch (error) {
          await transaction.rollback();
          throw "Erro na transação";
        }
      }
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { reservaId, experiencia, avaliacao, quantidadePessoas } = req.body;
    if (reservaId == null) throw 'A reserva deve ser informada!';
    const feedback = await Feedback.findByPk(id, { include: { all: true, nested: true } });
    if (feedback == null) throw 'Feedback não encontrado!';
    const transaction = await sequelize.transaction();
    Object.assign(feedback, { reservaId: reservaId.id, experiencia, avaliacao, quantidadePessoas });

    await feedback.save({ transaction: transaction });
    try {
      await transaction.commit();
      return await Feedback.findByPk(feedback.id, { include: { all: true, nested: true } });
    }
    catch (error) {
      await transaction.rollback();
      throw "Erro na transação";
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const feedback = await Feedback.findByPk(id);
    if (feedback == null) throw 'Feedback não encontrado!';
    try {
      await feedback.destroy();
      return feedback;
    } catch (error) {
      throw 'Não é possível remover um feedback associado à uma reserva!';
    }
  }


  static async verificaRegrasDeNegocio(req) {
    const { reservaId } = req.body;
    if (await this.regraNegocio1(reservaId) &&
      await this.regraNegocio2(reservaId) &&
      await this.regraNegocio3(reservaId)) {
      return true;
    }
    return false;
  }

  // 1. Há o limite de 1 feedback por reserva.
  static regraNegocio1 = async (reservaId) => {
    const feedback = await Feedback.findOne({ where: { reservaId: reservaId } });
    if (feedback != null) throw 'Já existe um feedback para esta reserva!';
    return true;
  }

  // 2. Os feedbacks de reservas só podem ser realizados em no máximo 15 dias após a data da reserva.
  static regraNegocio2 = async (reservaId) => {
    const reserva = await Reserva.findByPk(reservaId);
    if (reserva == null) throw 'Reserva não encontrada!';
    const dataAtual = new Date();
    const diffDays = FeedbackService.calculaDiferencaDatasEmDias(dataAtual, reserva.dtInicio);
    if (diffDays > 15) throw 'O feedback só pode ser realizado em até 15 dias após a data da reserva!';
    return true;
  }

  // 3. Só é possível realizar um total de 3 feedbacks por mês por cliente
  static regraNegocio3 = async (reservaId) => {
    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva) throw 'Reserva não encontrada!';

    const clienteId = reserva.clienteId;
    const { inicioMes, fimMes } = this.calculaInicioFimMes();

    // Busca as reservas desse cliente
    const reservasCliente = await Reserva.findAll({
      where: { clienteId: clienteId },
      attributes: ['id']
    });

    const reservaIds = reservasCliente.map(r => r.id);

    const totalFeedbacks = await Feedback.count({
      where: {
        reservaId: reservaIds,
        createdAt: {
          [Op.gte]: inicioMes,
          [Op.lte]: fimMes
        }
      }
    });

    if (totalFeedbacks >= 3) throw 'Só é possível realizar um total de 3 feedbacks por mês!';
    return true;
  };


  static async verificaCamposFormulario(body) {
    const { reservaId, experiencia, quantidadePessoas } = body;
    if (reservaId == null) throw 'A reserva deve ser informada!';
    if (experiencia == null || 3 > experiencia.lenght > 255) throw 'a experiência deve ser descrita com no mínimo 3 e no máximo 255 caracteres!';
    if (quantidadePessoas == null) throw 'A quantidade de pessoas deve ser informada!';
    return true;
  }

  static calculaDiferencaDatasEmDias(dataAtual, dataReserva) {
    const diffTime = Math.abs(dataAtual - dataReserva);
    const diffDays = Math.ceil(diffTime / (this.converteHorasEmDia()));
    return diffDays;
  }

  static converteHorasEmDia() {
    const dia = 1000 * 60 * 60 * 24;
    return dia;
  }

  static calculaInicioFimMes() {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { inicioMes, fimMes };
  }


  static async relatorioFeedbackPeriodo(req, res) {
    try {
      const { dtInicio, dtTermino } = req.body;

      if (!dtInicio || !dtTermino) {
        throw new Error('As datas de início e fim devem ser informadas!');
      }

      const inicio = new Date(dtInicio);
      const fim = new Date(dtTermino);

      if (inicio > fim) {
        throw new Error('A data de início não pode ser maior que a data de fim!');
      }

      const resultado = await Feedback.findAll({
        attributes: [
          [fn('strftime', '%Y-%m', col('created_at')), 'mes'],
          [fn('COUNT', '*'), 'quantidade']
        ],
        where: {
          created_at: {
            [Op.gte]: inicio,
            [Op.lte]: fim
          }
        },
        group: [fn('strftime', '%Y-%m', col('created_at'))],
        order: [[fn('strftime', '%Y-%m', col('created_at')), 'ASC']],
        raw: true
      });

      // ✅ resposta correta
      res.json(resultado);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ message: `Erro ao gerar relatório: ${error.message}` });
    }
  }

}

export { FeedbackService }