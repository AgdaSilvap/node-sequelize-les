import { EditoraService } from "../services/EditoraService";

class EditoraController {

  static async findAll(req, res, next) {
    EditoraService.findAll()
      .then(editoras => res.json(editoras))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    EditoraService.findByPk(req)
      .then(editora => res.json(editora))
      .catch(next);
  }

  static async create(req, res, next) {
    EditoraService.create(req)
      .then(editora => res.json(editora))
      .catch(next);
  }

  static async update(req, res, next) {
    EditoraService.update(req)
      .then(editora => res.json(editora))
      .catch(next);
  }

  static async delete(req, res, next) {
    EditoraService.delete(req)
      .then(editora => res.json(editora))
      .catch(next);
  }
}