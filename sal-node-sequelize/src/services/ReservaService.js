//Sofia
import { Reserva } from "../models/Reserva.js";

import sequelize from "../config/database-connection.js";

class ReservaService {
  static async findAll() {
    const objs = await Reserva.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Reserva.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {
    const { dtReserva, dtInicio, dtTermino, cliente, funcionario, sala } = req.body; //cliente, funcionario e sala são associações com outras tabelas
    if (cliente == null) throw 'O cliente deve ser preenchido!'; //cliente, funcionario e sala são foreign keys
    if (funcionario == null) throw 'O funcionário deve ser preenchido!';
    if (sala == null) throw 'A sala deve ser preenchida!;'
    const obj = await Bairro.create({ dtReserva, dtInicio, dtTermino, clienteId: cliente.id, funcionarioId: funcionario.id, salaId: sala.id }); //como cliente, funcionário e sala são foreign keys, a referência fica da forma que coloquei
    return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
        const { dtReserva, dtInicio, dtTermino, cliente, funcionario, sala } = req.body;
        if (cliente == null) throw 'O cliente deve ser preenchido!'; 
        if (funcionario == null) throw 'O funcionário deve ser preenchido!';
        if (sala == null) throw 'A sala deve ser preenchida!;'
        const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Reserva não encontrada!';
        Object.assign(obj, { dtReserva, dtInicio, dtTermino, clienteId: cliente.id, funcionarioId: funcionario.id, salaId: sala.id });
        await obj.save();
        return await Reserva.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
        const obj = await Reserva.findByPk(id);
        if (obj == null)
          throw 'Reserva não encontrada!';
        try {
          await obj.destroy();
          return obj;
        } catch (error) {
          throw "Não é possível remover a reserva.";
        }
  }
}

export { ReservaService };
