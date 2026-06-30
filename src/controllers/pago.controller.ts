import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { Reserva, Transaccion } from '../models';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export const crearPreferencia = async (req: Request, res: Response) => {
    try {
        const { reserva_id, titulo_cancha, precio } = req.body;

        const reserva = await Reserva.findByPk(reserva_id);

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' })
        }

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: reserva_id,
                        title: titulo_cancha,
                        quantity: 1,
                        unit_price: Number(precio)
                    }
                ],
                back_urls: {
                    success: 'https://satisfy-revise-idealize.ngrok-free.dev/pago/exito',
                    failure: 'https://satisfy-revise-idealize.ngrok-free.dev/pago/fallo', //Cambias despues el enlace
                    pending: 'https://satisfy-revise-idealize.ngrok-free.dev/pago/pendiente'
                },
                notification_url: 'https://satisfy-revise-idealize.ngrok-free.dev/api/pagos/webhook',
                auto_return: 'approved',
                external_reference: reserva_id,
            }
        });

        await Transaccion.create({
            reserva_id: reserva_id,
            preference_id: result.id,
            estado_pago: 'pending'
        })

        res.status(200).json({
            preferenceId: result.id,
            linkDePago: result.sandbox_init_point
        })
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        res.status(500).json({ error: 'Error al generar el pago' })
    }
}

export const recibirWebhook = async (req: Request, res: Response) => {
    try {
        const paymentId = req.query.id || req.body.data?.id;
        const topic = req.query.topic || req.body.type;

        res.status(200).send('Webhook recibido');

        if (topic === 'payment' && paymentId) {
            console.log(`⏳ Procesando pago ID: ${paymentId}`);

            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: paymentId as string });

            const estadoMP = paymentInfo.status;
            const reservaId = paymentInfo.external_reference;
            const montoPagado = paymentInfo.transaction_amount;

            if (!reservaId) return;

            await Transaccion.update(
                {
                    payment_id: paymentId as string,
                    estado_pago: estadoMP,
                    monto_pagado: montoPagado
                },
                { where: { reserva_id: reservaId } }
            );

            if (estadoMP === 'approved') {
                await Reserva.update(
                    { estado_reserva: 'confirmada' },
                    { where: { id: reservaId } }
                );
                console.log(`✅ Reserva ${reservaId} confirmada exitosamente.`);
            } else if (estadoMP === 'rejected') {
                await Reserva.update(
                    { estado_reserva: 'cancelada' }, // O 'pendiente' si le das otra chance
                    { where: { id: reservaId } }
                );
                console.log(`❌ Pago rechazado para la reserva ${reservaId}.`);
            }
        }
    } catch (error) {
        console.error('❌ Error crítico al procesar webhook:', error);
    }
};