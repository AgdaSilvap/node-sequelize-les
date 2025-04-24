import { AluguelDeLivro } from "../models/AluguelDeLivro.js";
import { Livro } from "../models/Livro.js";

import sequelize from "../config/database-connection.js";

class AluguelDeLivroService {
  static async findAll() {
    const objs = await AluguelDeLivro.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }
  static async findByPk(req) {
    const { id } = req.params;
    const obj = await AluguelDeLivro.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }


  static async create(req) {
    const { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, livros, clienteId, funcionarioId } = req.body;
    const t = await sequelize.transaction();
    const obj = await AluguelDeLivro.create({ dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, clienteId, funcionarioId }, { transaction: t });
    try {
      await Promise.all(livros.map((livroId) => obj.addLivros(livroId, { transaction: t })));
      await t.commit();
      return await AluguelDeLivro.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      await t.rollback();
      throw new Error('Erro ao associar os livros ao aluguel!');
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, livros, clienteId, funcionarioId } = req.body;
  
    // Verificando se os parâmetros obrigatórios foram enviados
    if (!livros || !Array.isArray(livros) || livros.length === 0) {
      throw new Error('É necessário enviar pelo menos um livro para o aluguel.');
    }
  
    // Encontrando o aluguel pelo ID
    const obj = await AluguelDeLivro.findByPk(id, { include: { all: true, nested: true } });
    
    // Verificando se o aluguel existe
    if (obj == null) throw 'Aluguel não encontrado!';
  
    const t = await sequelize.transaction();
  
    // Atribuindo os valores ao objeto de aluguel
    Object.assign(obj, { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, clienteId, funcionarioId });
    await obj.save({ transaction: t });
  
    try {
      // Removendo as associações antigas dos livros
      await sequelize.models.aluguel_livros.destroy({ where: { aluguel_de_livro_id: obj.id }, transaction: t });
  
      // Verificando se os livros existem no banco antes de adicionar
      const livrosExistentes = await Livro.findAll({ where: { id: livros } });
      if (livrosExistentes.length !== livros.length) {
        throw new Error('Um ou mais livros não foram encontrados.');
      }
  
      // Adicionando os livros à associação
      await Promise.all(
        livros.map(livroId => obj.addLivros(livroId, { transaction: t }))
      );
  
      // Comitando a transação
      await t.commit();
  
      // Retornando o objeto atualizado com as associações
      return await AluguelDeLivro.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      // Desfazendo a transação em caso de erro
      await t.rollback();
  
      // Logando o erro completo para diagnóstico
      console.error('Erro ao atualizar o aluguel de livro:', error);
  
      // Lançando uma mensagem de erro mais detalhada
      throw new Error(`Erro ao atualizar o aluguel de livro: ${error.message || error}`);
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await AluguelDeLivro.findByPk(id);
  
    if (obj == null) throw 'Aluguel não encontrado!';
  
    const hoje = new Date();
    const devolucao = new Date(obj.dtDevolucao);
  
    if (devolucao > hoje) {
      throw "Não é possível remover um aluguel em aberto!";
    }
  
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Erro ao tentar remover o aluguel.";
    }
  }
  
}

export { AluguelDeLivroService };
