
import express from "express";

import { ClienteController } from "./controllers/ClienteController.js";
import { FuncionarioController } from "./controllers/FuncionarioController.js";
import { AluguelDeLivroController } from "./controllers/AluguelDeLivroController.js";
import { LivroController } from './controllers/LivroController.js';
import { ReservaController } from './controllers/ReservaController.js';
import { SalaController } from './controllers/SalaController.js';
import { AutorController } from './controllers/AutorController.js';
import { EditoraController } from './controllers/EditoraController.js';
import { FeedbackController } from './controllers/FeedbackController.js';

const routes = express.Router();

//BIANCA
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

//SOFIA
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
routes.get('/clientes/:clienteId/reservas', ReservaController.listarReservasPorCliente);


routes.get('/salas', SalaController.findAll);
routes.get('/salas/:id', SalaController.findByPk);
routes.post('/salas', SalaController.create);
routes.put('/salas/:id', SalaController.update);
routes.delete('/salas/:id', SalaController.delete);

//AGDA
routes.get('/autores', AutorController.findAll);
routes.get('/autores/:id', AutorController.findByPk);
routes.post('/autores', AutorController.create);
routes.put('/autores/:id', AutorController.update);
routes.delete('/autores/:id', AutorController.delete);
routes.get('/autores/:id/editoras', AutorController.listaEditorasPorAutor);

routes.get('/editoras', EditoraController.findAll);
routes.get('/editoras/:id', EditoraController.findByPk);
routes.post('/editoras', EditoraController.create);
routes.put('/editoras/:id', EditoraController.update);
routes.delete('/editoras/:id', EditoraController.delete);

routes.get('/feedbacks', FeedbackController.findAll);
routes.get('/feedbacks/:id', FeedbackController.findByPk);
routes.post('/feedbacks', FeedbackController.create);
routes.put('/feedbacks/:id', FeedbackController.update);
routes.delete('/feedbacks/:id', FeedbackController.delete);
routes.get('/relatorio-feedback-periodo', FeedbackController.relatorioFeedbackPeriodo);

export { routes };
