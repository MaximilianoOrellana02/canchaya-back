import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Cancha = sequelize.define('Cancha', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    nombre: { type: DataTypes.STRING(150), allowNull: false},
    tipo: { type: DataTypes.STRING(50), allowNull: false},
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false},
    duracion_turno: { type: DataTypes.INTEGER, allowNull: false},
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
    complejo_id: { type: DataTypes.UUID, allowNull: false}
}, {
    tableName: 'canchas',
    timestamps: true,
    paranoid: true
})

export default Cancha