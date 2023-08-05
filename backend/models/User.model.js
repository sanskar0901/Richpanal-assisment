const mongoose = require('mongoose');
const Subscription = require('./Subscription.model');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptions: { type: [mongoose.Schema.Types.ObjectId], ref: Subscription },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
