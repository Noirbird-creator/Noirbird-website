const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);
router.post('/paypal', async (req, res) => {
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: total } }]
    });
    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;