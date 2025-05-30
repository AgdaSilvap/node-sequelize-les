import { AluguelDeLivro } from "../models/AluguelDeLivro.js";
import { Livro } from "../models/Livro.js";
import { Op, QueryTypes } from "sequelize"; // Importar Op para operações do Sequelize
import { Cliente } from "../models/Cliente.js";
import { Autor } from "../models/Autor.js";

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
    const { dtAluguel, vlTotal, livros, clienteId, funcionarioId } = req.body;
    let calculatedDtDevolucao;
    let dsTipoAluguel;

    this._verificaCamposAluguel(req.body);

    try {
      //   const { livrosDetalhes, tipoDosLivros } = await this._verificaRegrasDeNegocio(req.body);
      const { tipoDosLivros } = await this._verificaRegrasDeNegocio(req.body);

      if (tipoDosLivros.toUpperCase() === "LITERATURA") {
        dsTipoAluguel = "Mensal";
        calculatedDtDevolucao = new Date(
          new Date(dtAluguel).setMonth(new Date(dtAluguel).getMonth() + 1)
        );
      } else if (tipoDosLivros.toUpperCase() === "TÉCNICO") {
        dsTipoAluguel = "Semanal";
        calculatedDtDevolucao = new Date(
          new Date(dtAluguel).setDate(new Date(dtAluguel).getDate() + 7)
        );
      } else {
        throw new Error(
          `Tipo de livro desconhecido para cálculo de devolução: '${tipoDosLivros}'. Por favor, use 'Literatura' ou 'Técnico'.`
        );
      }
    } catch (error) {
      console.error(
        "Erro de validação ou cálculo do aluguel (na criação):",
        error.message
      );
      throw new Error(
        `Não foi possível registrar o aluguel. Detalhes: ${error.message}`
      );
    }

    const t = await sequelize.transaction();
    let obj;
    try {
      obj = await AluguelDeLivro.create(
        {
          dtAluguel,
          dtDevolucao: calculatedDtDevolucao,
          dsTipoAluguel,
          vlTotal,
          clienteId,
          funcionarioId,
        },
        { transaction: t }
      );
      await Promise.all(
        livros.map((livroId) => obj.addLivros(livroId, { transaction: t }))
      );
      await t.commit();
      return await AluguelDeLivro.findByPk(obj.id, {
        include: { all: true, nested: true },
      });
    } catch (error) {
      await t.rollback();
      console.error(
        "Erro ao registrar o aluguel ou associar os livros (na transação):",
        error
      );
      throw new Error(`Erro ao registrar o aluguel: ${error.message || error}`);
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { dtAluguel, vlTotal, livros, clienteId, funcionarioId } = req.body;
    let calculatedDtDevolucao;
    let dsTipoAluguel;

    this._verificaCamposAluguel(req.body);

    const obj = await AluguelDeLivro.findByPk(id, {
      include: { all: true, nested: true },
    });

    if (obj == null) throw "Aluguel não encontrado!";

    const t = await sequelize.transaction();

    try {
      //   const { livrosDetalhes, tipoDosLivros } = await this._verificaRegrasDeNegocio(req.body, obj.id);
      const { tipoDosLivros } = await this._verificaRegrasDeNegocio(req.body);

      const dataAluguelBase = new Date(dtAluguel || obj.dtAluguel);
      calculatedDtDevolucao = new Date(dataAluguelBase);

      if (tipoDosLivros.toUpperCase() === "LITERATURA") {
        dsTipoAluguel = "Mensal";
        calculatedDtDevolucao.setMonth(calculatedDtDevolucao.getMonth() + 1);
      } else if (tipoDosLivros.toUpperCase() === "TÉCNICO") {
        dsTipoAluguel = "Semanal";
        calculatedDtDevolucao.setDate(calculatedDtDevolucao.getDate() + 7);
      } else {
        throw new Error(
          `Tipo de livro desconhecido para cálculo de devolução: '${tipoDosLivros}'. Por favor, use 'Literatura' ou 'Técnico'.`
        );
      }

      Object.assign(obj, {
        dtAluguel,
        dtDevolucao: calculatedDtDevolucao,
        dsTipoAluguel,
        vlTotal,
        clienteId,
        funcionarioId,
      });
      await obj.save({ transaction: t });

      await obj.setLivros(livros, { transaction: t });

      await t.commit();
      return await AluguelDeLivro.findByPk(obj.id, {
        include: { all: true, nested: true },
      });
    } catch (error) {
      await t.rollback();
      console.error("Erro ao atualizar o aluguel de livro:", error);
      throw new Error(
        `Erro ao atualizar o aluguel de livro: ${error.message || error}`
      );
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await AluguelDeLivro.findByPk(id);

    if (obj == null) throw "Aluguel não encontrado!";

    const hojeUtc = new Date();
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

  // --- NOVOS MÉTODOS DE RELATÓRIO ---

  static async getLivrosAlugadosPorClienteNoPeriodo(req) {
    const { clienteId } = req.params;
    const { dtInicio, dtFim } = req.query;

    if (!clienteId || !dtInicio || !dtFim) {
      throw new Error(
        "Parâmetros clienteId, dtInicio e dtFim são obrigatórios para este relatório."
      );
    }

    const dataInicio = new Date(dtInicio);
    const dataFim = new Date(dtFim);

    const sqlQuery = `
      SELECT
          "AluguelDeLivro".id AS "aluguelId",
          "AluguelDeLivro"."dtAluguel",
          "AluguelDeLivro"."dtDevolucao",
          "AluguelDeLivro"."dsTipoAluguel",
          "AluguelDeLivro"."vlTotal",
          "cliente"."dsNome" AS "clienteNome",
          "cliente"."dsCpf" AS "clienteCpf",
          "livros->aluguel_livros"."livroId" AS "livroId",
          "livros"."nmLivro" AS "livroNome",
          "livros"."dsTipo" AS "livroTipo",
          "livros"."vlAluguel" AS "livroValor",
          "livros->autor"."nome" AS "autorNome"
      FROM
          "aluguelDeLivros" AS "AluguelDeLivro"
      INNER JOIN
          "clientes" AS "cliente" ON "AluguelDeLivro"."clienteId" = "cliente".id
      INNER JOIN
          "aluguel_livros" AS "livros->aluguel_livros" ON "AluguelDeLivro".id = "livros->aluguel_livros"."aluguelId"
      INNER JOIN
          "livros" AS "livros" ON "livros->aluguel_livros"."livroId" = "livros".id
      LEFT OUTER JOIN
          "autores" AS "livros->autor" ON "livros"."autorId" = "livros->autor".id
      WHERE
          "AluguelDeLivro"."clienteId" = :clienteId
          AND "AluguelDeLivro"."dtAluguel" BETWEEN :dtInicio AND :dtFim
      ORDER BY
          "AluguelDeLivro"."dtAluguel" ASC, "cliente"."dsNome" ASC, "livros"."nmLivro" ASC;
    `;

    try {
      const objs = await sequelize.query(sqlQuery, {
        replacements: {
          clienteId: clienteId,
          dtInicio: dataInicio,
          dtFim: dataFim,
        },
        type: QueryTypes.SELECT,
      });
      return objs;
    } catch (error) {
      console.error(
        "Erro ao gerar relatório de livros alugados por cliente:",
        error
      );
      throw new Error(`Erro ao gerar relatório: ${error.message || error}`);
    }
  }

  static async getLivrosAlugadosPorAutorNoPeriodo(req) {
    const { autorId } = req.params;
    const { dtInicio, dtFim } = req.query;

    if (!autorId || !dtInicio || !dtFim) {
      throw new Error(
        "Parâmetros autorId, dtInicio e dtFim são obrigatórios para este relatório."
      );
    }

    const dataInicio = new Date(dtInicio);
    const dataFim = new Date(dtFim);

    const sqlQuery = `
      SELECT
          "autor"."nome" AS "autorNome",
          "livros".id AS "livroId",
          "livros"."nmLivro" AS "livroNome",
          "livros"."dsTipo" AS "livroTipo",
          "livros"."vlAluguel" AS "livroValor",
          "AluguelDeLivro".id AS "aluguelId",
          "AluguelDeLivro"."dtAluguel",
          "AluguelDeLivro"."dtDevolucao",
          "cliente".id AS "clienteId",
          "cliente"."dsNome" AS "clienteNome",
          "cliente"."dsCpf" AS "clienteCpf"
      FROM
          "autores" AS "autor"
      INNER JOIN
          "livros" AS "livros" ON "livros"."autorId" = "autor".id
      INNER JOIN
          "aluguel_livros" AS "aluguel_livros" ON "livros".id = "aluguel_livros"."livroId"
      INNER JOIN
          "aluguelDeLivros" AS "AluguelDeLivro" ON "aluguel_livros"."aluguelId" = "AluguelDeLivro".id
      INNER JOIN
          "clientes" AS "cliente" ON "AluguelDeLivro"."clienteId" = "cliente".id
      WHERE
          "autor".id = :autorId
          AND "AluguelDeLivro"."dtAluguel" BETWEEN :dtInicio AND :dtFim
      ORDER BY
          "AluguelDeLivro"."dtAluguel" ASC, "livros"."nmLivro" ASC, "cliente"."dsNome" ASC;
    `;

    try {
      const objs = await sequelize.query(sqlQuery, {
        replacements: {
          autorId: autorId,
          dtInicio: dataInicio,
          dtFim: dataFim,
        },
        type: QueryTypes.SELECT,
      });
      return objs;
    } catch (error) {
      console.error(
        "Erro ao gerar relatório de livros alugados por autor:",
        error
      );
      throw new Error(`Erro ao gerar relatório: ${error.message || error}`);
    }
  }

  static async _verificaRegrasDeNegocio(dadosAluguel, aluguelIdAtual = null) {
    const { livros, clienteId, dtAluguel } = dadosAluguel;

    // 1. Verificar se os livros existem e obter detalhes
    const livrosDetalhes = await Livro.findAll({
      where: {
        id: {
          [Op.in]: livros,
        },
      },
    });
    this._verificaLivrosEncontrados(livros, livrosDetalhes);

    // 2. Verificar disponibilidade dos livros (RNF 8)
    await this._verificaDisponibilidadeLivros(livros, aluguelIdAtual);

    // 3. Verificar se todos os livros são do mesmo tipo (RNF 10)
    // O retorno é importante para o cálculo da data de devolução
    const tipoDosLivros = this._verificaTipoLivroHomogeneo(livrosDetalhes);

    // 4. Verificar se o cliente possui aluguel pendente (RN 3)
    // Esta regra só se aplica à criação de novos aluguéis, não à atualização de um existente.
    // No update, não se espera que um cliente possa ter 2 alugueis ABERTOS ao mesmo tempo.
    if (!aluguelIdAtual) {
      await this._verificaAluguelPendenteCliente(clienteId);
    }

    // 5. Verificar limite de aluguéis por mês e tempo de cadastro do cliente (RN 1 e 2)
    // Esta regra também só se aplica à criação de novos aluguéis.
    if (!aluguelIdAtual) {
      await this._verificaLimiteAlugueisCliente(clienteId, dtAluguel);
    }

    return { livrosDetalhes, tipoDosLivros };
  }
  static _verificaCamposAluguel(body) {
    const { livros } = body;
    if (!livros || !Array.isArray(livros) || livros.length === 0) {
      throw new Error(
        "É necessário informar pelo menos um livro para o aluguel."
      );
    }
    return true;
  }
  static _verificaLivrosEncontrados(livrosRequisicao, livrosDetalhes) {
    if (livrosDetalhes.length !== livrosRequisicao.length) {
      throw new Error("Um ou mais livros informados não foram encontrados.");
    }
    return true;
  }
  static async _verificaDisponibilidadeLivros(
    livrosIds,
    aluguelIdAtual = null
  ) {
    const agora = new Date(); // Data e hora atual

    const whereCondition = {
      dtDevolucao: {
        [Op.gt]: agora, // Aluguéis cuja data de devolução ainda não passou
      },
    };

    if (aluguelIdAtual) {
      whereCondition.id = {
        [Op.ne]: aluguelIdAtual, // Exclui o próprio aluguel na atualização
      };
    }

    const alugueisAtivosDosLivros = await AluguelDeLivro.findAll({
      include: {
        model: Livro,
        as: "livros",
        where: {
          id: {
            [Op.in]: livrosIds,
          },
        },
        through: { attributes: [] },
      },
      where: whereCondition,
    });

    if (alugueisAtivosDosLivros.length > 0) {
      const livrosIndisponiveis = new Set();
      alugueisAtivosDosLivros.forEach((aluguel) => {
        aluguel.livros.forEach((livroIndisponivel) => {
          if (livrosIds.includes(livroIndisponivel.id)) {
            livrosIndisponiveis.add(livroIndisponivel.dsTitulo);
          }
        });
      });

      if (livrosIndisponiveis.size > 0) {
        const listaLivrosIndisponiveis =
          Array.from(livrosIndisponiveis).join(", ");
        const acao = aluguelIdAtual ? "atualizar" : "alugar";
        throw new Error(
          `Não é possível ${acao}. O(s) livro(s) ${listaLivrosIndisponiveis} já está(ão) alugado(s) por outro cliente e ainda não foi(ram) devolvido(s).`
        );
      }
    }
    return true;
  }
  static _verificaTipoLivroHomogeneo(livrosDetalhes) {
    if (!livrosDetalhes || livrosDetalhes.length === 0) {
      throw new Error("Não há livros para verificar o tipo.");
    }

    const primeiroLivroTipo = livrosDetalhes[0].dsTipo;
    for (const livro of livrosDetalhes) {
      if (livro.dsTipo !== primeiroLivroTipo) {
        throw new Error(
          `Não é permitido alugar livros de tipos diferentes em um mesmo aluguel. Todos os livros devem ser do mesmo Tipo (Literatura ou Técnico).`
        );
      }
    }
    return primeiroLivroTipo;
  }
  static async _verificaAluguelPendenteCliente(clienteId) {
    const agora = new Date(); // Data e hora atual para comparação

    const aluguelPendente = await AluguelDeLivro.findOne({
      where: {
        clienteId: clienteId,
        dtDevolucao: {
          [Op.gt]: agora, // Aluguéis cuja data de devolução ainda não passou
        },
      },
    });

    if (aluguelPendente) {
      throw new Error(
        `O cliente possui um aluguel pendente com data de devolução em ${aluguelPendente.dtDevolucao.toLocaleDateString(
          "pt-BR"
        )}. Não é possível realizar um novo aluguel antes da devolução.`
      );
    }
    return true;
  }
  static async _verificaLimiteAlugueisCliente(clienteId, dtAluguel) {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    const dtCadastroCliente = new Date(cliente.dtCadastro);
    const dataAluguelAtual = new Date(dtAluguel);

    let limiteAlugueisParaCliente = 3; // Limite padrão

    // Calcula 1 mês antes da data atual para verificar cadastro recente
    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);

    // Regra: Cliente com menos de 1 mês de cadastro, e aluguel no mês do cadastro ou mês seguinte, limite é 1.
    const isMesmoMesCadastro =
      dataAluguelAtual.getMonth() === dtCadastroCliente.getMonth() &&
      dataAluguelAtual.getFullYear() === dtCadastroCliente.getFullYear();

    const isMesSeguinteCadastro =
      dataAluguelAtual.getMonth() === (dtCadastroCliente.getMonth() + 1) % 12 &&
      (dataAluguelAtual.getFullYear() === dtCadastroCliente.getFullYear() || // Mesmo ano
        (dataAluguelAtual.getMonth() === 0 &&
          dtCadastroCliente.getMonth() === 11 &&
          dataAluguelAtual.getFullYear() ===
            dtCadastroCliente.getFullYear() + 1)); // Virada de ano

    if (
      dtCadastroCliente > umMesAtras &&
      (isMesmoMesCadastro || isMesSeguinteCadastro)
    ) {
      limiteAlugueisParaCliente = 1;
    }

    // Calcular o primeiro e último dia do mês do aluguel atual
    const primeiroDiaDoMes = new Date(
      dataAluguelAtual.getFullYear(),
      dataAluguelAtual.getMonth(),
      1
    );
    const ultimoDiaDoMes = new Date(
      dataAluguelAtual.getFullYear(),
      dataAluguelAtual.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const totalAlugueisNoMes = await AluguelDeLivro.count({
      where: {
        clienteId: clienteId,
        dtAluguel: {
          [Op.between]: [primeiroDiaDoMes, ultimoDiaDoMes],
        },
      },
    });

    if (totalAlugueisNoMes >= limiteAlugueisParaCliente) {
      throw new Error(
        `O cliente já atingiu o limite de ${limiteAlugueisParaCliente} aluguéis neste mês.`
      );
    }
    return true;
  }
}

export { AluguelDeLivroService };
