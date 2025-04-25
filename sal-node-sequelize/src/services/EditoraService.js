import { Editora } from "../models/Editora.js";

class EditoraService {
  static async findAll() {
    const editoras = await Editora.findAll({ include: { all: true, nested: true } });
    return editoras;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const editora = await Editora.findByPk(id, { include: { all: true, nested: true } });
    return editora;
  }


  static async create(req) {
    const { nome, cnpj, endereco, telefone, email, website } = req.body;
    console.log(req.body);
    if (nome == null || 3 > nome.lenght > 50) throw 'O nome da editora deve ser preenchido com no mínimo 3 e no máximo 50 caracteres!';
    if (cnpj == null || 14 > cnpj.lenght > 18) throw 'O CNPJ não foi preenchido corretamente!';
    if (endereco == null || 5 > endereco.lenght > 50) throw 'O endereço deve ser preenchido com no mínimo 5 e no máximo 50 caracteres!';
    if (telefone == null || 10 > telefone.lenght > 17) throw 'O telefone deve ser preenchido com o DDD!';
    if (email == null || 5 > email.lenght > 50) throw 'O email não foi preenchido corretamente!';
    if (website == null || 5 > website.lenght > 50) throw 'O website não foi preenchido corretamente!';

    const editora = await Editora.create({ nome, cnpj, endereco, telefone, email, website });
    return await Editora.findByPk(editora.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cnpj, endereco, telefone, email, website } = req.body;
    if (nome == null) throw 'O nome da editora deve ser preenchido!';
    const editora = await Editora.findByPk(id, { include: { all: true, nested: true } });
    if (editora == null) throw 'Editora não encontrada!';
    Object.assign(editora, { nome, cnpj, endereco, telefone, email, website });
    await editora.save();
    return await Editora.findByPk(editora.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const editora = await Editora.findByPk(id);
    if (editora == null) throw 'Editora não encontrada!';
    try {
      await editora.destroy();
      return editora;
    } catch (error) {
      throw 'Não é possível remover uma editora associada à um livro!';
    }
  }
}

export { EditoraService }