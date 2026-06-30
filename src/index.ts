import "dotenv/config"
import express, { Application } from "express";
import cors from "cors";
import sequelize from "./config/db";
import './models/index'

const app: Application = express();
import rutasPrincipales from './routes/index'

app.use(express.json());
app.use(cors({ origin: "http://localhost:4200" }));
app.set("port", process.env.PORT || 3000);

//Rutas
app.use('/api', rutasPrincipales)

sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log("Tablas de PostgreSQL sincronizadas");

    app.listen(app.get("port"), () => {
      console.log(`Server started on port ${app.get("port")}`);
    });
  })
  .catch((err: Error) => {
    console.error(
      "No se pudo iniciar el servidor debido a un error en la BD:",
      err,
    );
  });
