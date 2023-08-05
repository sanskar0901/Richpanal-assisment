const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    videoQuality: { type: String, required: true },
    resolution: { type: String, required: true },
    devices: { type: [String], required: true },
    screens: { type: Number, required: true },
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
