import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

sequelize.authenticate().then(() => {
  console.log('Base de datos conectada');
}).catch((err: any) => {
  console.error('Error al conectar a la base de datos', err);
})

export default sequelize
