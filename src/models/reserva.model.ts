import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Reserva = sequelize.define('Reserva', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    usuario_id: { type: DataTypes.UUID, allowNull: false },
    cancha_id: { type: DataTypes.UUID, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora_inicio: { type: DataTypes.TIME, allowNull: false },
    hora_fin: { type: DataTypes.TIME, allowNull: false },
    monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado_reserva: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada'),
        defaultValue: 'pendiente',
        allowNull: false
    }
}, {
    tableName: 'reservas',
    timestamps: true
});

export default Reserva;