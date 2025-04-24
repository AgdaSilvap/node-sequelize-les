import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Autor } from '../models/Autor.js';
import { Editora } from '../models/Editora.js';
import { Feedback } from '../models/Feedback.js';
import { Cliente } from '../models/Cliente.js';
import { Funcionario } from '../models/Funcionario.js';
import { AluguelDeLivro } from '../models/AluguelDeLivro.js';
import { Livro } from '../models/Livro.js';
import { Sala } from '../models/Sala.js';
import { Reserva } from '../models/Reserva.js';

const sequelize = new Sequelize(databaseConfig);

Autor.init(sequelize);
Editora.init(sequelize);
Feedback.init(sequelize);
Cliente.init(sequelize);
Funcionario.init(sequelize);
AluguelDeLivro.init(sequelize);
Livro.init(sequelize);
Sala.init(sequelize);
Reserva.init(sequelize);

Autor.associate(sequelize.models);
Editora.associate(sequelize.models);
Feedback.associate(sequelize.models);
Cliente.associate(sequelize.models);
Funcionario.associate(sequelize.models);
AluguelDeLivro.associate(sequelize.models);
Livro.associate(sequelize.models);
Sala.associate(sequelize.models);
Reserva.associate(sequelize.models);

databaseInserts();

function databaseInserts() {
  (async () => {

    await sequelize.sync({ force: true })


    // Inserindo 4 clientes - BIANCA
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

    //aluna : AGDA
    //inserindo 4 autores 
    const autor1 = await Autor.create({
      nome: 'J.K. Rowling',
      nascimento: '1965-07-31',
      nacionalidade: 'Inglesa'
    });

    const autor2 = await Autor.create({
      nome: 'J.R.R. Tolkien',
      nascimento: '1892-01-03',
      nacionalidade: 'Inglesa'
    });

    const autor3 = await Autor.create({
      nome: 'Jhon Grey',
      nascimento: '1977-08-29',
      nacionalidade: 'Estadunidense'
    });

    const autor4 = await Autor.create({
      "nome": "Gabriel García Márquez",
      "nascimento": "1927-03-06",
      "nacionalidade": "Colombiano"
    });

    //inserindo 4 editoras
    const editora1 = await Editora.create({
      nome: 'Rocco',
      cnpj: '00.000.000/0001-00',
      edereco: 'Rua 1, 1',
      telefone: '111111-1111'
    });

    const editora2 = await Editora.create({
      nome: 'Alta Books',
      cnpj: '00.000.000/0002-00',
      edereco: 'Rua 2, 2',
      telefone: '222222-2222'
    });

    const editora3 = await Editora.create({
      "nome": "Editora Globo",
      "cnpj": "11.111.111/0001-11",
      "endereco": "Avenida Paulista, 1000",
      "telefone": "(22) 3333-3333"
    });

    const editora4 = await Editora.create({
      "nome": "Companhia das Letras",
      "cnpj": "22.222.222/0002-22",
      "endereco": "Rua dos Editores, 500",
      "telefone": "(11) 4444-4444"
    });

    //aluna: SOFIA
    //inserindo 4 livros
    const livro1 = await Livro.create({
      dsTitulo: 'Harry Potter e a Pedra Filosofal',
      dtPublicacao: '1997-06-26',
      isbn: '978-3-16-148410-0',
      dsGenero: 'Fantasia',
      nrPaginas: 223,
      dsTipo: 'Impresso',
      editoraId: editora1.id,
      autorId: autor1.id
    });

    const livro2 = await Livro.create({
      dsTitulo: 'O Senhor dos Anéis',
      dtPublicacao: '1954-07-29',
      isbn: '978-0-261-10236-2',
      dsGenero: 'Fantasia',
      nrPaginas: 1178,
      dsTipo: 'Impresso',
      editoraId: editora2.id,
      autorId: autor2.id
    });

    const livro3 = await Livro.create({
      dsTitulo: 'Dom Quixote',
      dtPublicacao: '1605-01-16',
      isbn: '978-0060934347',
      dsGenero: 'Clássico',
      nrPaginas: 1023,
      dsTipo: 'Digital',
      editoraId: editora2.id,
      autorId: autor2.id
    });

    const livro4 = await Livro.create({
      dsTitulo: '1984',
      dtPublicacao: '1949-06-08',
      isbn: '978-0451524935',
      dsGenero: 'Distopia',
      nrPaginas: 328,
      dsTipo: 'Físico',
      editoraId: editora2.id,
      autorId: autor2.id
    });


    //inserindo 4 salas - SOFIA
    const sala1 = await Sala.create({
      qtCapacidade: 10,
      dsApelido: 'Sala de Leitura 1',
      refrigerado: true
    });

    const sala2 = await Sala.create({
      qtCapacidade: 15,
      dsApelido: 'Sala de Leitura 2',
      refrigerado: false
    });

    const sala3 = await Sala.create({
      qtCapacidade: 30,
      dsApelido: 'Sala C',
      refrigerado: true
    });

    const sala4 = await Sala.create({
      qtCapacidade: 40,
      dsApelido: 'Sala D',
      refrigerado: false
    });

    //inserindo 4 reservas - SOFIA
    const reserva1 = await Reserva.create({
      dtReserva: new Date(),
      dtInicio: new Date(),
      dtTermino: new Date(new Date().getTime() + 60 * 60 * 1000),
      clienteId: 1,
      funcionarioId: 1,
      salaId: sala1.id
    });

    const reserva2 = await Reserva.create({
      dtReserva: new Date(),
      dtInicio: new Date(),
      dtTermino: new Date(new Date().getTime() + 120 * 60 * 1000),
      clienteId: 2,
      funcionarioId: 2,
      salaId: sala2.id
    });

    const reserva3 = await Reserva.create({
      dtReserva: new Date(),
      dtInicio: new Date(),
      dtTermino: new Date(new Date().getTime() + 60 * 60 * 1000),
      salaId: sala3.id
    });

    const reserva4 = await Reserva.create({
      dtReserva: new Date(),
      dtInicio: new Date(),
      dtTermino: new Date(new Date().getTime() + 60 * 60 * 1000),
      salaId: sala4.id
    });


    //inserindo 4 feedbacks - AGDA
    const feedback1 = await Feedback.create({
      experiencia: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      avaliacao: true,
      quantidadePessoas: 1,
      id_cliente: 1,
      id_reserva_sala: 1,
      dtCarga: new Date()
    });

    const feedback2 = await Feedback.create({
      experiencia: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      avaliacao: true,
      quantidadePessoas: 1,
      id_cliente: 2,
      id_reserva_sala: 2,
      dtCarga: new Date()
    });

    const feedback3 = await Feedback.create({
      experiencia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      avaliacao: true,
      quantidadePessoas: 1,
      id_cliente: 1,
      id_reserva_sala: 1,
      dtCarga: new Date()
    });

    const feedback4 = await Feedback.create({
      experiencia: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      avaliacao: true,
      quantidadePessoas: 5,
      id_cliente: 2,
      id_reserva_sala: 2,
      dtCarga: new Date()
    });



    // Inserindo 4 aluguéis de livro - BIANCA
    const aluguel1 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-01'),
      dtDevolucao: new Date('2025-03-15'),
      dsTipoAluguel: 'Mensal',
      vlTotal: 50.0,
      clienteId: 1,
      funcionarioId: 1
    });

    const aluguel2 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-05'),
      dtDevolucao: new Date('2025-03-20'),
      dsTipoAluguel: 'Quinzenal',
      vlTotal: 30.0,
      clienteId: 2,
      funcionarioId: 2
    });

    const aluguel3 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-10'),
      dtDevolucao: new Date('2025-03-25'),
      dsTipoAluguel: 'Semanal',
      vlTotal: 20.0,
      clienteId: 3,
      funcionarioId: 4
    });

    const aluguel4 = await AluguelDeLivro.create({
      dtAluguel: new Date('2025-03-15'),
      dtDevolucao: new Date('2025-06-30'),
      dsTipoAluguel: 'Mensal',
      vlTotal: 50.0,
      clienteId: 4,
      funcionarioId: 3
    });

    await aluguel1.addLivros(livro1, { through: 'aluguel_livros', });
    await aluguel2.addLivros(livro2, { through: 'aluguel_livros', });
    await aluguel3.addLivros(livro3, { through: 'aluguel_livros', });
    await aluguel4.addLivros(livro4, { through: 'aluguel_livros', });


  })()
}

export default sequelize;