// controllers/planController.js

const express = require('express');
const User = require('../models/User.model');
const BillingPlan = require('../models/Plan.model');
const Subscription = require('../models/Subscription.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
router.post('/subscribe', async (req, res) => {
    const { userId, planId, billingInterval, paymentMethodId } = req.body;

    try {
        console.log(planId)
        const user = await User.findById(userId);
        const plan = await BillingPlan.findById(planId);
        console.log(plan);
        billingInterval === 'yearly' ? priceId = plan.yearlyId : priceId = plan.monthlyId

        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        })
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: paymentMethodId }
        })
        const stripeSubscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
        });

        const subscription = new Subscription({
            user: userId,
            plan: planId,
            billingInterval,
            stripeSubscriptionId: stripeSubscription.id,
            status: "initiated"
        });

        await subscription.save();
        user.subscriptions.push(subscription._id);
        await user.save();

        res.json({ message: 'Subscription successful', status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating subscription' + err, status: false });
    }
});

module.exports = router;

router.post('/cancel', async (req, res) => {
    const { userId, subscriptionId } = req.body;

    try {
        const subscription = await Subscription.findOne({ _id: subscriptionId, user: userId });
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        await stripe.subscriptions.del(subscription.stripeSubscriptionId);

        await Subscription.findByIdAndRemove(subscriptionId);

        res.json({ message: 'Subscription canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
