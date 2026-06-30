import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import bcrypt from "bcrypt";

const Usuario = sequelize.define(
  "Usuarios",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: {
      type: DataTypes.ENUM("admin", "duenio", "jugador"),
      allowNull: false,
    },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario: any) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario: any) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  },
);

export default Usuario;
