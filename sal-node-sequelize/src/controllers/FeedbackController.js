import { FeedbackService } from "../services/FeedbackService.js";

class FeedbackController {

  static async findAll(req, res, next) {
    FeedbackService.findAll()
      .then(feedbacks => res.json(feedbacks))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    FeedbackService.findByPk(req)
      .then(feedback => res.json(feedback))
      .catch(next);
  }

  static async create(req, res, next) {
    FeedbackService.create(req)
      .then(feedback => res.json(feedback))
      .catch(next);
  }

  static async update(req, res, next) {
    FeedbackService.update(req)
      .then(feedback => res.json(feedback))
      .catch(next);
  }

  static async delete(req, res, next) {
    FeedbackService.delete(req)
      .then(feedback => res.json(feedback))
      .catch(next);
  }
}

export { FeedbackController };