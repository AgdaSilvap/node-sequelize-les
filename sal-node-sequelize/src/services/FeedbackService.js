import { Feedback } from "../models/Feedback.js";

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
    const { reserva, experiencia, avaliacao, quantidadePessoas } = req.body;
    if (reserva == null) throw 'A reserva deve ser informada!';
    if (experiencia == null || 3 > length(experiencia) > 255) throw 'a experiência deve ser descrita com no mínimo 3 e no máximo 255 caracteres!';
    if (quantidadePessoas == null) throw 'A quantidade de pessoas deve ser informada!';

    const transaction = await Sequelize.transaction();

    const feedback = await Feedback.create({ reservaId: reserva.id, experiencia, avaliacao, quantidadePessoas, feedbackId: feedback.id }, { transaction: transaction });
    return await Feedback.findByPk(feedback.id, { include: { all: true, nested: true } });
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