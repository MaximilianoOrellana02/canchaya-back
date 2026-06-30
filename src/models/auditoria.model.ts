import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Auditoria = sequelize.define('Auditoria', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    accion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    entidad: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    entidad_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    navegador: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'auditorias',
    timestamps: true,
    updatedAt: false,
})

export default Auditoria