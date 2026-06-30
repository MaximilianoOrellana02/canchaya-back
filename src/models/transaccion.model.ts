import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Transaccion = sequelize.define('Transaccion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    reserva_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    preference_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    payment_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    estado_pago: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
    },
    monto_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    }

}, {
    tableName: 'transacciones',
    timestamps: true
})

export default Transaccion