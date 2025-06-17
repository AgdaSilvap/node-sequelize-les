import express from 'express';
import { routes } from './routes.js';
import errorHandler from './middleware/error-handler.js';

import sequelize from './config/database-connection.js';

const app = express();

// Cabeçalhos adicionados antes que as rotas sejam definidas
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});