//Sofia
import { SalaService } from "../services/SalaService.js";

class SalaController {
  static async findAll(req, res, next) {
    SalaService.findAll()
      .then((objs) => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    SalaService.findByPk(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    SalaService.create(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    SalaService.update(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    SalaService.delete(req)
      .then((obj) => res.json(obj))
      .catch(next);
  }
}

export { SalaController };
