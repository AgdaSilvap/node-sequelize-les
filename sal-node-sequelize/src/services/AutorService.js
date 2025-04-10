import { Autor } from "../models/Autor.js";

class AutorService {

  static async findAll() {
    const autores = await Autor.findAll({ include: { all: true, nested: true } });
    return autores;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const autor = await Autor.findByPk(id, { include: { all: true, nested: true } });
    return autor;
  }

  static async create(req) {
    const { nome, nascimento, nacionalidade } = req.body;
    if (nome == null) throw 'O nome deve ser preenchido!';
    if (nascimento == null) throw 'A data de nascimento deve ser preenchida!';
    if (nacionalidade == null) throw 'A nacionalidade deve ser preenchida!';
    const autor = await Autor.create({ nome, nascimento, nacionalidade, autorId: autor.id });
    return await Autor.findByPk(autor.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, nascimento, nacionalidade } = req.body;
    if (nome == null) throw 'O nome do autor deve ser preenchido!';
    const autor = await Autor.findByPk(id, { include: { all: true, nested: true } });
    if (autor == null) throw 'Autor não encontrado!';
    Object.assign(autor, { nome, nascimento, nacionalidade });
    await autor.save();
    return await Autor.findByPk(id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);
    if (autor == null) throw 'Autor não encontrado!';
    try {
      await autor.destroy();
      return autor;
    } catch (error) {
      throw 'Não é possível remover um autor associado à um livro!';
    }
  }
}

export { AutorService };