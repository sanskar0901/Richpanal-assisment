// routes/plans.js

const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/add', async (req, res) => {
    try {
        const { name, monthlyPrice, yearlyPrice, videoQuality, resolution, devices, screens } = req.body;
        const product = await stripe.products.create({
            name: name,
            description: monthlyPrice + ' per month or ' + yearlyPrice + ' per year',
        });
        const monthy = await stripe.plans.create({
            amount: monthlyPrice * 100,
            currency: 'usd',
            interval: 'month',
            product: product.id,
            nickname: 'Basic monthly',
            metadata: {
                interval: 'month',
                resolution: resolution,
                videoQuality: videoQuality,
                videoQuality: videoQuality,
                devices: devices.toString,
                screens: screens,
            }
        });
        const yearly = await stripe.plans.create({
            amount: yearlyPrice * 100,
            currency: 'usd',
            interval: 'year',
            product: product.id,
            nickname: 'Basic yearly',
            metadata: {
                interval: 'year',
                resolution: resolution,
                videoQuality: videoQuality,
                videoQuality: videoQuality,
                devices: devices.toString(),
                screens: screens,
            }
        })
        const newPlan = await Plan.create({ name, monthlyPrice, yearlyPrice, videoQuality, resolution, devices, screens, monthlyId: monthy.id, yearlyId: yearly.id })
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create the plan.' + error });
    }
});

router.get('/get', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch plans.' + error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found.' });
        }
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the plan.' });
    }
})
router.put('/:id', async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found.' });
        }
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the plan.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found.' });
        }
        res.status(200).json({ message: 'Plan deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the plan.' });
    }
});



module.exports = router;
