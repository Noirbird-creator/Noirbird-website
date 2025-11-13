const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.post('/stripe', async (req, res) => {
    const { items } = req.body;
    try {
        const line_items = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;