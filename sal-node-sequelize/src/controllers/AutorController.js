import { AutorService } from "../services/AutorService";

class AutorController {

  static async findAll(req, res, next) {
    AutorService.findAll()
      .then(autores => res.json(autores))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    AutorService.findByPk(req)
      .then(autor => res.json(autor))
      .catch(next);
  }

  static async create(req, res, next) {
    AutorService.create(req)
      .then(autor => res.json(autor))
      .catch(next);
  }

  static async update(req, res, next) {
    AutorService.update(req)
      .then(autor => res.json(autor))
      .catch(next);
  }

  static async delete(req, res, next) {
    AutorService.delete(req)
      .then(autor => res.json(autor))
      .catch(next);
  }

}

export { AutorController };