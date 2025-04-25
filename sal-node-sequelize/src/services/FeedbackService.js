import { Feedback } from "../models/Feedback.js";
import sequelize from "../config/database-connection.js";

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
    if (reservaId == null) throw 'A reserva deve ser informada!';
    if (experiencia == null || 3 > experiencia.lenght > 255) throw 'a experiência deve ser descrita com no mínimo 3 e no máximo 255 caracteres!';
    if (quantidadePessoas == null) throw 'A quantidade de pessoas deve ser informada!';

    const transaction = await sequelize.transaction();
    const feedback = await Feedback.create({ reservaId: reservaId, experiencia, avaliacao, quantidadePessoas }, { transaction: transaction });
    try {
      await transaction.commit();
      return await Feedback.findByPk(feedback.id, { include: { all: true, nested: true } });
    } catch (error) {
      await transaction.rollback();
      throw "Caiu no catch";
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { reserva, experiencia, avaliacao, quantidadePessoas } = req.body;
    if (reserva == null) throw 'A reserva deve ser informada!';
    const feedback = await Feedback.findByPk(id, { include: { all: true, nested: true } });
    if (feedback == null) throw 'Feedback não encontrado!';
    Object.assign(feedback, { reservaId: reserva.id, experiencia, avaliacao, quantidadePessoas });
    await feedback.save();
    return await Feedback.findByPk(feedback.id, { include: { all: true, nested: true } });
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
}

export { FeedbackService }