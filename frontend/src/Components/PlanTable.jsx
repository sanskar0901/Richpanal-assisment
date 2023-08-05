import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../constants'
import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from './Modal';
import Navbar from './Navbar';
const stripePromise = loadStripe('pk_test_51MwPq1SB27RQWA1pF86ZOljFE3IWwg5p5lN2ZltOna4T4MrVUsvNjWu61s1LtiQd7o7NmNbMYeggPYB1bqGYHZyc00Raj2RPlu');
const PlanTable = () => {
    const [plans, setPlans] = useState([]);
    const [showYearly, setShowYearly] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // ... (existing code)

    const handleSubscribeClick = () => {
        setShowPaymentForm(true);
    };

    const handleModalClose = () => {
        setShowPaymentForm(false);
    };
    useEffect(() => {
        // Fetch plans from the backend
        axios
            .get(`${api}/plan/get`)
            .then((response) => {
                setPlans(response.data);
                // Set the default selected plan ID (e.g., th
            })
            .catch((error) => {
                console.error('Error fetching plans:', error);
            });
    }, []);

    const togglePlanDuration = () => {
        setShowYearly((prevShowYearly) => !prevShowYearly);
    };

    const handlePlanSelect = (planId) => {
        setSelectedPlanId(planId);
    };

    // Get the selected plan based on the selectedPlanId
    const selectedPlan = plans.find((plan) => plan._id === selectedPlanId);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center">

                <div className="flex items-center justify-center mt-4 mb-2">
                    <button
                        className={`px-4 py-2 rounded-full ${showYearly ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'
                            }`}
                        onClick={togglePlanDuration}
                    >
                        Monthly
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ml-2 ${showYearly ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}
                        onClick={togglePlanDuration}
                    >
                        Yearly
                    </button>
                </div>
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Plan Name</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Video Quality</th>
                            <th className="border px-4 py-2">Resolution</th>
                            <th className="border px-4 py-2">Devices</th>
                            <th className="border px-4 py-2">Screens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan._id} className={`${plan._id === selectedPlanId ? 'bg-blue-400' : ''} hover:cursor-pointer hover:bg-slate-300`} onClick={() => handlePlanSelect(plan._id)}>
                                <td className="border px-4 py-2"> <button

                                    className="px-4 py-2 bg-blue-500 text-white rounded-full"
                                >
                                    {plan.name}
                                </button></td>
                                <td className="border px-4 py-2">
                                    {showYearly ? `$${plan.yearlyPrice}` : `$${plan.monthlyPrice}`}
                                </td>
                                <td className="border px-4 py-2">{plan.videoQuality}</td>
                                <td className="border px-4 py-2">{plan.resolution}</td>
                                <td className="border px-4 py-2">{plan.devices.toString()}</td>
                                <td className="border px-4 py-2">{plan.screens}</td>
                                <td className="border px-4 py-2">

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <button
                        onClick={handleSubscribeClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full"
                    >
                        Subscribe
                    </button>
                    <Modal isOpen={showPaymentForm} onClose={handleModalClose}>
                        {showPaymentForm && (
                            <Elements stripe={stripePromise}>
                                <PaymentForm selectedPlan={selectedPlan} billingInterval={showYearly ? 'yearly' : 'monthly'} onClose={handleModalClose}
                                />
                            </Elements>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default PlanTable;
