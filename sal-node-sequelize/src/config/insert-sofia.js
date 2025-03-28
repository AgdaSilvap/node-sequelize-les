import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Autor } from '../models/Autor.js';
import { Editora } from '../models/Editora.js';
import { Feedback } from '../models/Feedback.js';
import { Livro } from '../models/Livro.js';
import { Sala } from '../models/Sala.js';
import { Reserva } from '../models/Reserva.js';

const sequelize = new Sequelize(databaseConfig);

Autor.init(sequelize);
Editora.init(sequelize);
Feedback.init(sequelize);
Livro.init(sequelize);
Sala.init(sequelize);
Reserva.init(sequelize);

Autor.associate(sequelize.models);
Editora.associate(sequelize.models);
Feedback.associate(sequelize.models);
Livro.associate(sequelize.models);
Sala.associate(sequelize.models);
Reserva.associate(sequelize.models);

databaseInserts();

function databaseInserts() {
  (async () => {
    await sequelize.sync({ force: true });

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

    const editora1 = await Editora.create({
      nome: 'Rocco',
      cnpj: '00.000.000/0001-00',
      endereco: 'Rua 1, 1',
      telefone: '111111-1111'
    });

    const editora2 = await Editora.create({
      nome: 'Alta Books',
      cnpj: '00.000.000/0002-00',
      endereco: 'Rua 2, 2',
      telefone: '222222-2222'
    });

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

    const feedback1 = await Feedback.create({
      experiencia: 'Ótima sala, muito confortável!',
      avaliacao: true,
      quantidadePessoas: 5,
      clienteId: 1,
      reservaId: reserva1.id,
      dtCarga: new Date()
    });

    const feedback2 = await Feedback.create({
      experiencia: 'A sala poderia ser mais silenciosa.',
      avaliacao: false,
      quantidadePessoas: 3,
      clienteId: 2,
      reservaId: reserva2.id,
      dtCarga: new Date()
    });
  })();
}

export default sequelize;
