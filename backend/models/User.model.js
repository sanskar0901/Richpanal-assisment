const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'BillingPlan', required: true },
    billingInterval: { type: String, enum: ['monthly', 'yearly'], required: true },
    stripeSubscriptionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptions: [subscriptionSchema],
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
