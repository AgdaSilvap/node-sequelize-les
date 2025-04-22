import express from "express";

import { LivroController } from './controller/LivroController.js';
import { ReservaController } from './controller/ReservaController.js';
import { SalaController } from './controller/SalaController.js';

const routes = express.Router();

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

export default routes;