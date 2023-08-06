// controllers/planController.js
const nodemailer = require('nodemailer');
const express = require('express');
const User = require('../models/User.model');
const BillingPlan = require('../models/Plan.model');
const Subscription = require('../models/Subscription.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
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
        let expDate = billingInterval === 'monthly' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 365 * 24 * 60 * 60 * 1000
        const subscription = new Subscription({
            user: userId,
            plan: planId,
            billingInterval,
            stripeSubscriptionId: stripeSubscription.id,
            expDate
        });

        await subscription.save();
        user.subscriptions.push(subscription._id);
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Subscription Confirmation',
            html: `<h2>Subscription Confirmation</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for subscribing to our ${plan.name} plan. Your subscription is now active.</p>
            <center>
            <h3>Plan Details:</h3>
            <p><strong>Plan Name:</strong> ${plan.name}</p>
            <p><strong>Monthly Price:</strong> ${plan.monthlyPrice}</p>
            <p><strong>Yearly Price:</strong> ${plan.yearlyPrice}</p>
            <p><strong>Video Quality:</strong> ${plan.videoQuality}</p>
            <p><strong>Resolution:</strong> ${plan.resolution}</p>
            <p><strong>Devices You Can Use to Watch:</strong> ${plan.devices}</p>
            <p><strong>Number of Active Screens at One Time:</strong> ${plan.screens}</p>
            </center>
            <p>Best regards,</p>
            <p>RichPanel Team</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json({ message: 'Subscription successful', status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating subscription' + err, status: false });
    }
});


router.post('/cancel', async (req, res) => {
    const { subscriptionId } = req.body;

    try {
        const subscription = await Subscription.findOne({ _id: subscriptionId });
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

router.get('/get/:id', async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.params.id });
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Fetch plans for each subscription using Promise.all() and map
        const plansPromises = subscriptions.map(async (subs) => {
            const plan = await BillingPlan.findById(subs.plan);
            return {
                ...plan.toObject(),
                expDate: subs.expDate,
                billingInterval: subs.billingInterval,
                stripeSubscriptionId: subs.stripeSubscriptionId,
                subscriptionId: subs._id
            };
        });

        const plans = await Promise.all(plansPromises);

        res.json({ plans });
    } catch (error) {
        res.status(500).json({ message: 'Server error' + error });
    }

})
module.exports = router;