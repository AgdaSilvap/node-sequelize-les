import express from "express";

import { ClienteController } from "./controller/ClienteController.js";
import { FuncionarioController } from "./controller/FuncionarioController.js";
// import { AluguelDeLivroController } from "./controller/AluguelDeLivroController.js";

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

// routes.get('/alugueis', AluguelDeLivroController.findAll);
// routes.get('/alugueis/:id', AluguelDeLivroController.findByPk);
// routes.post('/alugueis', AluguelDeLivroController.create);
// routes.put('/alugueis/:id', AluguelDeLivroController.update);
// routes.delete('/alugueis/:id', AluguelDeLivroController.delete);

export default routes;