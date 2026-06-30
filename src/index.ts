import "dotenv/config"
import express, { Application } from "express";
import cors from "cors";
import sequelize from "./config/db";
import './models/index'

const dominiosPermitidos = [
  'http://localhost:4200',                  // Tu entorno local
  'https://canchaya-front.vercel.app'       // Tu frontend en producción
];

const app: Application = express();
import rutasPrincipales from './routes/index'

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Permitimos peticiones sin origen (como herramientas tipo Postman) 
    // o las que estén en nuestra lista de permitidos
    if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true // Importante si después manejás cookies o tokens JWT
}));
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
