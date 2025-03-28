import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Cliente } from '../models/Cliente.js';
import { Funcionario } from '../models/Funcionario.js';
import { AluguelDeLivro } from '../models/AluguelDeLivro.js';

const sequelize = new Sequelize(databaseConfig);

Cliente.init(sequelize);
Funcionario.init(sequelize);
AluguelDeLivro.init(sequelize);

Cliente.associate(sequelize.models);
Funcionario.associate(sequelize.models);
AluguelDeLivro.associate(sequelize.models);

databaseInserts();

function databaseInserts() {
  (async () => {

    await sequelize.sync({ force: true });

    // Inserindo 4 clientes
    const cliente1 = await Cliente.create({
      dsNome: 'Ana Silva',
      dsCpf: '123.456.789-01',
      dtNascimento: '1990-05-15',
      dsGenero: 'Feminino',
      dsTelefone: '1199999-9999',
      dsEndereco: 'Rua A, 123',
    });

    const cliente2 = await Cliente.create({
      dsNome: 'Carlos Oliveira',
      dsCpf: '987.654.321-00',
      dtNascimento: '1985-09-23',
      dsGenero: 'Masculino',
      dsTelefone: '1188888-8888',
      dsEndereco: 'Rua B, 456',
    });

    const cliente3 = await Cliente.create({
      dsNome: 'Mariana Costa',
      dsCpf: '111.222.333-44',
      dtNascimento: '1998-12-10',
      dsGenero: 'Feminino',
      dsTelefone: '1177777-7777',
      dsEndereco: 'Rua C, 789',
    });

    const cliente4 = await Cliente.create({
      dsNome: 'Fernando Lima',
      dsCpf: '555.666.777-88',
      dtNascimento: '2000-03-30',
      dsGenero: 'Masculino',
      dsTelefone: '1166666-6666',
      dsEndereco: 'Rua D, 321',
    });

    // Inserindo 4 funcionários
    const funcionario1 = await Funcionario.create({
      dsNome: 'Bianca Rodrigues',
      dsCpf: '111.111.111-11',
      dtNascimento: '1980-07-22',
      dsGenero: 'Masculino',
      dsTelefone: '1155555-5555',
      dsEndereco: 'Rua X, 101',
      status: true
    });

    const funcionario2 = await Funcionario.create({
      dsNome: 'Agda Silva',
      dsCpf: '222.222.222-22',
      dtNascimento: '1992-04-18',
      dsGenero: 'Feminino',
      dsTelefone: '1144444-4444',
      dsEndereco: 'Rua Y, 202',
      status: true
    });

    const funcionario3 = await Funcionario.create({
      dsNome: 'Sofia Sartorio',
      dsCpf: '333.333.333-33',
      dtNascimento: '1987-11-05',
      dsGenero: 'Masculino',
      dsTelefone: '1133333-3333',
      dsEndereco: 'Rua Z, 303',
      status: false
    });

    const funcionario4 = await Funcionario.create({
      dsNome: 'Juliana Fernandes',
      dsCpf: '444.444.444-44',
      dtNascimento: '1995-06-29',
      dsGenero: 'Feminino',
      dsTelefone: '1122222-2222',
      dsEndereco: 'Rua W, 404',
      status: true
    });

    // Inserindo 4 aluguéis de livro
    const aluguel1 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-01'),
      dtDevolucao: new Date('2025-03-15'),
      dsTipoAluguel: 'Mensal',
      vlTotal: 50.0,
      clienteId: cliente1.id,
      funcionarioId: funcionario1.id
    });

    const aluguel2 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-05'),
      dtDevolucao: new Date('2025-03-20'),
      dsTipoAluguel: 'Quinzenal',
      vlTotal: 30.0,
      clienteId: cliente2.id,
      funcionarioId: funcionario2.id
    });

    const aluguel3 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-10'),
      dtDevolucao: new Date('2025-03-25'),
      dsTipoAluguel: 'Semanal',
      vlTotal: 20.0,
      clienteId: cliente3.id,
      funcionarioId: funcionario3.id
    });

    const aluguel4 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-15'),
      dtDevolucao: new Date('2025-03-30'),
      dsTipoAluguel: 'Mensal',
      vlTotal: 50.0,
      clienteId: cliente4.id,
      FuncionarioId: funcionario4.id
    });
  })();
}

export default sequelize;
