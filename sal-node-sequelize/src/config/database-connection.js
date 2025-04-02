import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Autor } from '../models/Autor.js';
import { Editora } from '../models/Editora.js';
import { Feedback } from '../models/Feedback.js';

const sequelize = new Sequelize(databaseConfig);

Autor.init(sequelize);
Editora.init(sequelize);
Feedback.init(sequelize);

Autor.associate(sequelize.models);
Editora.associate(sequelize.models);
Feedback.associate(sequelize.models);

databaseInserts();

function databaseInserts() {
  (async () => {

    await sequelize.sync({ force: true })

    //para testes SEM erros

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
      "telefone": "3333-3333"
    });

    const editora4 = await Editora.create({
      "nome": "Companhia das Letras",
      "cnpj": "22.222.222/0002-22",
      "endereco": "Rua dos Editores, 500",
      "telefone": "4444-4444"
    });

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


  })()
}

export default sequelize;