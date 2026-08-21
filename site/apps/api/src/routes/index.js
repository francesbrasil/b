import { Router } from 'express';
import healthCheck from './health-check.js';
import mercadopagoCheckout from './mercadopago-checkout.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.post('/mercadopago/checkout', mercadopagoCheckout);

    return router;
};
