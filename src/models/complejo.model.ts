import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Complejo = sequelize.define('Complejo', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    nombre: { type: DataTypes.STRING(150), allowNull: false},
    direccion: { type: DataTypes.STRING(255), allowNull: false},
    telefono: { type: DataTypes.STRING(50), allowNull: false},
    latitud: { type: DataTypes.DECIMAL(10, 8), allowNull: true},
    longitud: { type: DataTypes.DECIMAL(11, 8), allowNull: true},
    hora_apertura: { type: DataTypes.TIME, allowNull: false},
    hora_cierre: { type: DataTypes.TIME, allowNull: false},
    estado: { type: DataTypes.ENUM('pendiente', 'aprobado', 'suspendido'), defaultValue: 'pendiente'},
    usuario_duenio: { type: DataTypes.UUID, allowNull: false}
}, {
    tableName: 'complejos',
    timestamps: true
})

export default Complejo