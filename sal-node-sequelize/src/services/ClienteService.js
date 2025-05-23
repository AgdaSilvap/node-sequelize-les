import { Cliente } from "../models/Cliente.js";

import { QueryTypes } from "sequelize";
import sequelize from "../config/database-connection.js";

class ClienteService {

  static async findAll() {
    const objs = await Cliente.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {
    const { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco } = req.body;
    const obj = await Cliente.create({ dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco, dtCadastro: new Date() });
    return await Cliente.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco} = req.body;
    const obj = await Cliente.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Cliente não encontrado!';
    Object.assign(obj, { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco });
    return await obj.save();
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id);
    if (obj == null) throw 'Cliente não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Não é possível remover um Cliente com Aluguel em aberto.';
    }
  }

  static async findAlugueis() {
    const objs = await sequelize.query("SELECT c.* FROM clientes c JOIN aluguelDeLivros a ON a.cliente_id = c.id WHERE a.dt_devolucao > datetime('now')", { type: QueryTypes.SELECT });
    return objs;
  }
}

export { ClienteService };
