import express from 'express';
import routes from './routes.js';
import './config/database-connection.js';
import errorHandler from './_middleware/error-handler.js';


const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);
app.listen(3333, () => {
    console.log('Server started on port 3333');
});