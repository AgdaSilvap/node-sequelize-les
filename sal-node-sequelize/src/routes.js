
import express from "express";

import { ClienteController } from "./controller/ClienteController.js";
import { FuncionarioController } from "./controller/FuncionarioController.js";
import { AluguelDeLivroController } from "./controller/AluguelDeLivroController.js";
import { LivroController } from './controller/LivroController.js';
import { ReservaController } from './controller/ReservaController.js';
import { SalaController } from './controller/SalaController.js';
import { AutorController } from './controllers/AutorController.js';
import { EditoraController } from './controllers/EditoraController.js';

const routes = express.Router();

routes.get('/clientes', ClienteController.findAll);
routes.get('/clientes/:id', ClienteController.findByPk);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.delete);

routes.get('/funcionarios', FuncionarioController.findAll);
routes.get('/funcionarios/:id', FuncionarioController.findByPk);
routes.post('/funcionarios', FuncionarioController.create);
routes.put('/funcionarios/:id', FuncionarioController.update);
routes.delete('/funcionarios/:id', FuncionarioController.delete);

routes.get('/alugueis', AluguelDeLivroController.findAll);
routes.get('/alugueis/:id', AluguelDeLivroController.findByPk);
routes.post('/alugueis', AluguelDeLivroController.create);
routes.put('/alugueis/:id', AluguelDeLivroController.update);
routes.delete('/alugueis/:id', AluguelDeLivroController.delete);

routes.get('/livros', LivroController.findAll);
routes.get('/livros/:id', LivroController.findByPk);
routes.post('/livros', LivroController.create);
routes.put('/livros/:id', LivroController.update);
routes.delete('/livros/:id', LivroController.delete);

routes.get('/reservas', ReservaController.findAll);
routes.get('/reservas/:id', ReservaController.findByPk);
routes.post('/reservas', ReservaController.create);
routes.put('/reservas/:id', ReservaController.update);
routes.delete('/reservas/:id', ReservaController.delete);

routes.get('/salas', SalaController.findAll);
routes.get('/salas/:id', SalaController.findByPk);
routes.post('/salas', SalaController.create);
routes.put('/salas/:id', SalaController.update);
routes.delete('/salas/:id', SalaController.delete);

routes.get('/autores', AutorController.findAll);
routes.get('/autores/:id', AutorController.findByPk);
routes.post('/autores', AutorController.create);
routes.put('/autores/:id', AutorController.update);
routes.delete('/autores/:id', AutorController.delete);

routes.get('/editoras', EditoraController.findAll);
routes.get('/editoras/:id', EditoraController.findByPk);
routes.post('/editoras', EditoraController.create);
routes.put('/editoras/:id', EditoraController.update);
routes.delete('/editoras/:id', EditoraController.delete);

export { routes };
