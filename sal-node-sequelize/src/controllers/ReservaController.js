import { ReservaService } from "../services/ReservaService.js";

class ReservaController {
  static async findAll(req, res, next) {
    try {
      const objs = await ReservaService.findAll();
      res.json(objs);
    } catch (error) {
      next(error);
    }
  }

  static async findByPk(req, res, next) {
    try {
      const obj = await ReservaService.findByPk(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const obj = await ReservaService.create(req);
      res.status(201).json(obj);
    } catch (error) {
      res.status(400).json({ erro: error.toString() });
    }
  }

  static async update(req, res, next) {
    try {
      const obj = await ReservaService.update(req);
      res.json(obj);
    } catch (error) {
      res.status(400).json({ erro: error.toString() });
    }
  }

  static async delete(req, res, next) {
    try {
      const obj = await ReservaService.delete(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }

  static async listarReservasPorCliente(req, res, next) {
    try {
      const clienteId = req.params.clienteId;
      const reservas = await ReservaService.listarReservasPorCliente(clienteId);
      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }
}

export { ReservaController };