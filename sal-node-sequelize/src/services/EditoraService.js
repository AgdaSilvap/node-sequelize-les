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

  //findByLivro?? 

  static async create(req) {
    const { nome, cnpj, endereco, telefone, email, website } = req.body;
    if (nome == null) throw 'O nome da editora deve ser preenchido!';
    if (cnpj == null) throw 'O CNPJ deve ser preenchido!';
    if (endereco == null) throw 'O endereço deve ser preenchido!';
    if (telefone == null) throw 'O telefone deve ser preenchido!';
    if (email == null) throw 'O email deve ser preenchido!';
    if (website == null) throw 'O website deve ser preenchido!';

    const editora = await Editora.create({ nome, cnpj, endereco, telefone, email, website, editoraId: editora.id });
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