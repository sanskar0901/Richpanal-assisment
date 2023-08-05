const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    billingInterval: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    expDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;