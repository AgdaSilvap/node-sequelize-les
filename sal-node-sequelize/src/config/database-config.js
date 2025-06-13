// import dotenv from 'dotenv';
// dotenv.config();
// Configuração do banco de dados no ambiente de teste
// export const databaseConfig = {
//   dialect: 'sqlite',
//   storage: 'database.sqlite',
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   }
// };

// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};

// Configuração do banco de dados no ambiente de produção
// export const databaseConfig = {
//   dialect: 'postgres',
//   host: 'localhost',
//   port: 5433,
//   username: process.env.POSTGRES_USERNAME_PROD,
//   password: process.env.POSTGRES_PASSWORD_PROD,
//   database: process.env.POSTGRES_DATABASE_PROD,
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   },
//   dialectOptions: {
//     ssl: false
//   }
// }