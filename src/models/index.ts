import Usuario from './usuario.model';
import Complejo from './complejo.model';
import Cancha from './cancha.model';
import Reserva from './reserva.model';
import Transaccion from './transaccion.model';
import Valoracion from './valoracion.model';
import Auditoria from './auditoria.model';

// 1. RELACIONES DE INFRAESTRUCTURA

// Usuario (Dueño) <-> Complejo
Usuario.hasMany(Complejo, { foreignKey: 'usuario_duenio', as: 'complejos' });
Complejo.belongsTo(Usuario, { foreignKey: 'usuario_duenio', as: 'duenio' });

// Complejo <-> Cancha
Complejo.hasMany(Cancha, { foreignKey: 'complejo_id', as: 'canchas' });
Cancha.belongsTo(Complejo, { foreignKey: 'complejo_id', as: 'complejo' });

// 2. RELACIONES DE OPERACIÓN (NÚCLEO)

// Usuario (Jugador) <-> Reserva
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'jugador' });

// Cancha <-> Reserva
Cancha.hasMany(Reserva, { foreignKey: 'cancha_id', as: 'reservas' });
Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'cancha' });

// Reserva <-> Transaccion (MercadoPago)
// Una reserva puede tener múltiples intentos de pago (ej. si la primera tarjeta falla)
Reserva.hasMany(Transaccion, { foreignKey: 'reserva_id', as: 'transacciones' });
Transaccion.belongsTo(Reserva, { foreignKey: 'reserva_id', as: 'reserva' });

// 3. RELACIONES DE FEEDBACK Y SEGURIDAD

// Usuario <-> Valoracion
Usuario.hasMany(Valoracion, { foreignKey: 'usuario_id', as: 'valoraciones' });
Valoracion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

// Complejo <-> Valoracion
Complejo.hasMany(Valoracion, { foreignKey: 'complejo_id', as: 'valoraciones' });
Valoracion.belongsTo(Complejo, { foreignKey: 'complejo_id', as: 'complejo' });

// Usuario <-> Auditoria
// Un usuario genera muchos registros de auditoría (login, creación de reservas, etc.)
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id', as: 'auditorias' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// EXPORTACIÓN DE MODELOS
export {
  Usuario,
  Complejo,
  Cancha,
  Reserva,
  Transaccion,
  Valoracion,
  Auditoria
};