import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Valoracion = sequelize.define('Valoracion', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    complejo_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'valoraciones',
    timestamps: true
})

export default Valoracion