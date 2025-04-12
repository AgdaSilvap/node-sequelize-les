//Sofia
import { LivroService } from "../services/LivroService";

class LivroController {
  static async findAll(req, res, next) {
    LivroService.findAll()
      .then((objs) => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    LivroService.findByPk(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    LivroService.create(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    LivroService.update(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    LivroService.delete(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }
}

export { LivroController };
