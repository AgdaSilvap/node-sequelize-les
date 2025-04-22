import express from 'express';
import routes from './routes.js';
import errorHandler from './middleware/error-handler.js';

import sequelize from './config/database-connection.js';

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(3333, () => {
    console.log('Server started on port 3333');
});