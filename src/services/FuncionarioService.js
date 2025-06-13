import { Funcionario } from "../models/Funcionario.js";
class FuncionarioService {
  static async findAll() {
    const objs = await Funcionario.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }
  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }
  static async create(req) {
    const { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco, status } = req.body;
    const obj = await Funcionario.create({ dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco, status });
    return await Funcionario.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco, status } = req.body;
    const obj = await Funcionario.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Funcionario não encontrado!';
    Object.assign(obj, { dsNome, dsCpf, dtNascimento, dsGenero, dsTelefone, dsEndereco, status });
    return await obj.save();
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    if (obj == null) throw 'Funcionario não encontrado!';
    await obj.destroy();
    return obj;

  }
}

export { FuncionarioService };
