import { AluguelDeLivro } from "../models/AluguelDeLivro.js";
import { Livro } from "../models/Livro.js";
import { Op } from "sequelize"; // Importar Op para operações do Sequelize
import { Cliente } from "../models/Cliente.js";

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
    let calculatedDtDevolucao;
    if (!livros || !Array.isArray(livros) || livros.length === 0) {
      throw new Error('É necessário informar pelo menos um livro para o aluguel.');
    }

    try {
      const livrosDetalhes = await Livro.findAll({
        where: {
          id: {
            [Op.in]: livros
          }
        }
      });
      if (livrosDetalhes.length !== livros.length) {
        throw new Error('Um ou mais livros informados não foram encontrados.');
      }

      // -- Início da Implementação do Requisito Não Funcional 8 --

      const hojeUtc = new Date();
      // hojeUtc.setUTCHours(0, 0, 0, 0); // Zera hora para comparar apenas a data
      const alugueisAtivosDosLivros = await AluguelDeLivro.findAll({
        include: {
          model: Livro,
          as: 'livros', // Nome da associação no modelo AluguelDeLivro
          where: {
            id: {
              [Op.in]: livros // Filtra pelos IDs dos livros que estamos tentando alugar
            }
          },
          through: { attributes: [] } // Não precisamos dos atributos da tabela pivot aqui
        },
        where: {
          dtDevolucao: {
            [Op.gt]: hojeUtc // Aluguéis cuja data de devolução ainda não passou
          }
        }
      });

      if (alugueisAtivosDosLivros.length > 0) {
        const livrosIndisponiveis = new Set();
        alugueisAtivosDosLivros.forEach(aluguel => {
          aluguel.livros.forEach(livroIndisponivel => {
            // Adiciona o livro à lista de indisponíveis APENAS se ele for um dos livros que o cliente está tentando alugar
            if (livros.includes(livroIndisponivel.id)) {
              livrosIndisponiveis.add(livroIndisponivel.titulo);
            }
          });
        });

        if (livrosIndisponiveis.size > 0) {
          const listaLivrosIndisponiveis = Array.from(livrosIndisponiveis).join(', ');
          throw new Error(`Não é possível alugar. O(s) livro(s) ${listaLivrosIndisponiveis} já está(ão) alugado(s) e ainda não foi(ram) devolvido(s).`);
        }
      }
      // -- Início da Implementação do Requisito Não Funcional 10 --
      // Livros de tipos diferentes não podem estar no mesmo aluguel.
      const primeiroLivroTipo = livrosDetalhes[0].dsTipo;
      for (const livro of livrosDetalhes) {
        if (livro.dsTipo !== primeiroLivroTipo) {
          throw new Error('Não é permitido alugar livros de tipos diferentes em um mesmo aluguel.');
        }
      }
      // -- Fim da Implementação do Requisito Não Funcional 10 --

      // -- Início da Implementação da Regra de Negócio 3 --
      const aluguelPendente = await AluguelDeLivro.findOne({
        where: {
          clienteId: clienteId,
          dtDevolucao: {
            [Op.gt]: hojeUtc
          }
        }
      });

      if (aluguelPendente) {
        throw new Error(`O cliente possui um aluguel pendente com data de devolução em ${aluguelPendente.dtDevolucao.toLocaleDateString('pt-BR')}. Não é possível realizar um novo aluguel antes da devolução.`);
      }
      // -- Fim da Implementação da Regra de Negócio 3 --

      // -- Início da Implementação da Regra de Negócio 1 --
      const cliente = await Cliente.findByPk(clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado.');
      }

      const dtCadastroCliente = new Date(cliente.dtCadastro);
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);

      const dataAluguelAtual = new Date(dtAluguel);

      let limiteAlugueisParaCliente = 3;
      // Se o cliente tem menos de 1 mês de cadastro (desde a dtCadastro até a data do aluguel atual)
      // e o aluguel é para o mesmo mês do cadastro ou mês seguinte, o limite é 1.
      if (dtCadastroCliente > umMesAtras && dataAluguelAtual.getMonth() === dtCadastroCliente.getMonth() && dataAluguelAtual.getFullYear() === dtCadastroCliente.getFullYear()) {
        limiteAlugueisParaCliente = 1;
      }
      // Se o aluguel atual for no mês imediatamente seguinte ao cadastro, também limitar a 1
      else if (dtCadastroCliente > umMesAtras &&
        (dataAluguelAtual.getMonth() === (dtCadastroCliente.getMonth() + 1) % 12) &&
        (dataAluguelAtual.getFullYear() === dtCadastroCliente.getFullYear() || (dataAluguelAtual.getMonth() === 0 && dtCadastroCliente.getMonth() === 11 && dataAluguelAtual.getFullYear() === dtCadastroCliente.getFullYear() + 1))) {
        limiteAlugueisParaCliente = 1;
      }
      // -- Início da Implementação da Regra de Negócio 2 --
      // const dataAluguelAtual = new Date(dtAluguel);
      const primeiroDiaDoMes = new Date(dataAluguelAtual.getFullYear(), dataAluguelAtual.getMonth(), 1);
      const ultimoDiaDoMes = new Date(dataAluguelAtual.getFullYear(), dataAluguelAtual.getMonth() + 1, 0, 23, 59, 59, 999); // Último milissegundo do último dia do mês

      const totalAlugueisNoMes = await AluguelDeLivro.count({
        where: {
          clienteId: clienteId,
          dtAluguel: {
            [Op.between]: [primeiroDiaDoMes, ultimoDiaDoMes]
          }
        }
      });

      // const LIMITE_ALUGUEIS_POR_MES = 3;
      if (totalAlugueisNoMes >= limiteAlugueisParaCliente) {
        throw new Error(`O cliente já atingiu o limite de ${limiteAlugueisParaCliente} aluguéis neste mês.`);
      }
      // -- Fim da Implementação da Regra de Negócio 1 e  2 --

      // -- Início da Implementação do Requisito Não Funcional 9 --
      //Cada tipo de livro possui uma data de devolução específica. 
      // Livros técnicos: 1 semana, livros de literatura: 1 mês.
      const dataAluguel = new Date(dtAluguel);
      calculatedDtDevolucao = new Date(dataAluguel);
      if (primeiroLivroTipo.toUpperCase() === 'LITERATURA') {
        calculatedDtDevolucao.setMonth(calculatedDtDevolucao.getMonth() + 1);
      } else if (primeiroLivroTipo.toUpperCase() === 'TÉCNICO') {
        calculatedDtDevolucao.setDate(calculatedDtDevolucao.getDate() + 7);
      } else {
        throw new Error(`Tipo de livro desconhecido para cálculo de devolução: ${primeiroLivroTipo}. Por favor, use 'Literatura' ou 'Técnico'.`);
      }
    } catch (error) {
      // Captura erros específicos da lógica de cálculo da data de devolução
      console.error('Erro de validação ou cálculo da data de devolução:', error.message);
      throw new Error(`Não foi possível registrar o aluguel. Detalhes: ${error.message}`);
    }
    // -- Fim da Implementação do Requisito Não Funcional 9 --

    const t = await sequelize.transaction();
    let obj;
    // const obj = await AluguelDeLivro.create({ dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, clienteId, funcionarioId }, { transaction: t });
    try {
      obj = await AluguelDeLivro.create({
        dtAluguel,
        dtDevolucao: calculatedDtDevolucao, // Usando a data calculada
        dsTipoAluguel,
        vlTotal,
        clienteId,
        funcionarioId
      }, { transaction: t });
      await Promise.all(livros.map((livroId) => obj.addLivros(livroId, { transaction: t })));
      await t.commit();
      return await AluguelDeLivro.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      await t.rollback();
      console.error('Erro ao registrar o aluguel ou associar os livros:', error);
      throw new Error(`Erro ao registrar o aluguel: ${error.message || error}`);
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, livros, clienteId, funcionarioId } = req.body;
    let calculatedDtDevolucao;

    if (!livros || !Array.isArray(livros) || livros.length === 0) {
      throw new Error('É necessário enviar pelo menos um livro para o aluguel.');
    }

    const obj = await AluguelDeLivro.findByPk(id, { include: { all: true, nested: true } });

    if (obj == null) throw 'Aluguel não encontrado!';

    const t = await sequelize.transaction();

    try {
      const livrosDetalhes = await Livro.findAll({
        where: {
          id: {
            [Op.in]: livros
          }
        }
      });
      if (livrosDetalhes.length !== livros.length) {
        throw new Error('Um ou mais livros informados para atualização não foram encontrados.');
      }

      const hojeUtc = new Date();
      const alugueisAtivosDosLivros = await AluguelDeLivro.findAll({
        include: {
            model: Livro,
            as: 'livros',
            where: {
                id: {
                    [Op.in]: livros // Filtra pelos IDs dos livros que estamos tentando alugar
                }
            },
            through: { attributes: [] }
        },
        where: {
            dtDevolucao: {
                [Op.gt]: hojeUtc
            },
            // Exclui o próprio aluguel que está sendo atualizado da verificação de "aluguel ativo"
            id: {
                [Op.ne]: obj.id // [Op.ne] significa "not equal" (diferente de)
            }
        }
    });

    if (alugueisAtivosDosLivros.length > 0) {
      const livrosIndisponiveis = new Set();
      alugueisAtivosDosLivros.forEach(aluguel => {
          aluguel.livros.forEach(livroIndisponivel => {
              if (livros.includes(livroIndisponivel.id)) {
                  livrosIndisponiveis.add(livroIndisponivel.titulo);
              }
          });
      });

      if (livrosIndisponiveis.size > 0) {
          const listaLivrosIndisponiveis = Array.from(livrosIndisponiveis).join(', ');
          throw new Error(`Não é possível atualizar. O(s) livro(s) ${listaLivrosIndisponiveis} já está(ão) alugado(s) por outro cliente e ainda não foi(ram) devolvido(s).`);
      }
  }

      const primeiroLivroTipo = livrosDetalhes[0].dsTipo;
      for (const livro of livrosDetalhes) {
        if (livro.dsTipo !== primeiroLivroTipo) {
          throw new Error('Não é permitido atualizar o aluguel com livros de tipos diferentes.');
        }
      }
      // Recalcular dtDevolucao no update, caso a lista de livros ou dtAluguel mude
      const dataAluguel = new Date(dtAluguel || obj.dtAluguel); // Usa a nova dtAluguel ou a existente
      calculatedDtDevolucao = new Date(dataAluguel);

      if (primeiroLivroTipo.toUpperCase() === 'LITERATURA') {
        calculatedDtDevolucao.setMonth(calculatedDtDevolucao.getMonth() + 1);
      } else if (primeiroLivroTipo.toUpperCase() === 'TÉCNICO') {
        calculatedDtDevolucao.setDate(calculatedDtDevolucao.getDate() + 7);
      } else {
        throw new Error(`Tipo de livro desconhecido para cálculo de devolução: '${primeiroLivroTipo}'. Por favor, use 'Literatura' ou 'Técnico'.`);
      }

      Object.assign(obj, { dtAluguel, dtDevolucao, dsTipoAluguel, vlTotal, clienteId, funcionarioId });
      await obj.save({ transaction: t });

      await obj.setLivros([], { transaction: t });
      await Promise.all(
        livros.map(livroId => obj.addLivros(livroId, { transaction: t }))
      );
      await t.commit();
      return await AluguelDeLivro.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      await t.rollback();
      console.error('Erro ao atualizar o aluguel de livro:', error);
      throw new Error(`Erro ao atualizar o aluguel de livro: ${error.message || error}`);
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await AluguelDeLivro.findByPk(id);

    if (obj == null) throw 'Aluguel não encontrado!';

    const hojeUtc = new Date();
    // hojeUtc.setUTCHours(0,0,0,0);
    const devolucaoDb = new Date(obj.dtDevolucao);

    if (devolucaoDb >= hojeUtc) {
      throw "Não é possível remover um aluguel em aberto! O livro ainda não foi devolvido.";
    }

    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Erro ao tentar remover o aluguel. Verifique se não há dependências.";
    }
  }

}

export { AluguelDeLivroService };
