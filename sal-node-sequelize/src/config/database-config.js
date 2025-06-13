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
// export const databaseConfig = {
//   dialect: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'scv-backend-node-sequelize',
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   }
// };

// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'postgresql://postgres_prod_367m_user:HUgKP42y0VPAXrkGTY3Wm8phQEwK2V6h@dpg-d161bbfdiees73ek6jig-a.oregon-postgres.render.com/postgres_prod_367m',
  port: 5432,
  username: postgres_prod_367m_user,
  password: HUgKP42y0VPAXrkGTY3Wm8phQEwK2V6h,
  database: postgres_prod_367m,
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
}