const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    monthlyPrice: { type: Number, required: true },
    monthlyId: { type: String, required: true },
    yearlyId: { type: String, required: true },
    yearlyPrice: { type: Number, required: true },
    videoQuality: { type: String, required: true, enum: ['Good', 'Better', 'Best'] },
    resolution: { type: String, required: true, enum: ['720p', '480p', '1080p', '4K+HDR'] },
    devices: { type: [String], required: true, },
    screens: { type: Number, required: true },
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
