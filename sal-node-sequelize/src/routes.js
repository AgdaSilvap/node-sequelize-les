import express from 'express';
import { AutorController } from './controllers/AutorController.js';
import { EditoraController } from './controllers/EditoraController.js';

const routes = express.Router();

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