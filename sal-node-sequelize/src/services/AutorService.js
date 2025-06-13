import { Autor } from "../models/Autor.js";
import { Editora } from "../models/Editora.js";
import { Livro } from "../models/Livro.js";

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
    if (nome == null || 3 > nome.lenght > 50) throw 'O nome deve ter entre 3 e 50 caracteres!';
    if (nascimento == null) throw 'A data de nascimento deve ser preenchida!';
    if (nacionalidade == null || 5 > nacionalidade.lenght > 30) throw 'A nacionalidade deve ter entre 5 e 30 caracteres!';
    const autor = await Autor.create({ nome, nascimento, nacionalidade });
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

  static async listaEditorasPorAutor(req) {
    const { id } = req.params;

    const autor = await Autor.findByPk(id, {
      include: [{
        association: 'livros',
        include: [{
          association: 'editora'
        }]
      }]
    });

    if (!autor) throw 'Autor não encontrado!';

    const livros = autor.livros || [];

    const editoras = livros
      .map(livro => livro.editora)
      .filter((editora, index, self) =>
        editora && self.findIndex(e => e.id === editora.id) === index
      );

    return editoras;
  }
}

export  { AutorService };