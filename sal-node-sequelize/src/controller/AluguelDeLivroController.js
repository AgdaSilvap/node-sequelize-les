import { AluguelDeLivroService } from "../services/AluguelDeLivroService.js";

class AluguelDeLivroController {

    static async findAll(req, res, next) {
        AluguelDeLivroService.findAll().then(objs => res.json(objs)).catch(next);
    }

    static async findByPk(req, res, next) {
        AluguelDeLivroService.findByPk(req).then(obj => res.json(obj)).catch(next);
    }

    static async create(req, res, next) {
        AluguelDeLivroService.create(req).then(obj => res.json(obj)).catch(next);
    }

    static async update(req, res, next) {
        AluguelDeLivroService.update(req).then(obj => res.json(obj)).catch(next);
    }

    static async delete(req, res, next) {
        AluguelDeLivroService.delete(req).then(obj => res.json(obj)).catch(next);
    }
}

export { AluguelDeLivroController };