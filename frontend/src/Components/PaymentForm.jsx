import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../constants'
import cookie from 'js-cookie';

const PaymentForm = ({ selectedPlan, billingInterval, onClose }) => {
    const navigate = useNavigate();

    const cardElementOptions = {
        style: {
            base: {
                with: '10px',
                fontSize: '16px',
                color: '#333',
                '::placeholder': {
                    color: '#ccc',
                },
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                padding: '12px',
            },
            invalid: {
                color: '#e5424d',
            },
        },
    };
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = React.useState(null);
    const [isLoading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        console.log(selectedPlan._id);

        if (!stripe || !elements) {
            return;
        }
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
        });

        if (error) {
            console.error(error.message);
            setLoading(false);
            toast.error('Error creating subscription. Please try again.');
            return;
        }

        const paymentMethodId = paymentMethod.id;

        try {
            await toast.promise(
                axios.post(`${api}/subscription/subscribe`, {
                    paymentMethodId,
                    planId: selectedPlan._id,
                    userId: cookie.get('userId'),
                    billingInterval,
                }),
                {
                    pending: 'Creating subscription...',
                    success: 'Subscription created successfully!',
                    error: 'Error creating subscription. Please try again.',
                },
                {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            // setStatus(data.status);
            navigate('/dashboard');
            setLoading(false);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    return (
        <div className='rounded-md shadow-md p-4'>

            <h2 className="text-xl font-bold mb-4 text-center">Subscribe to {selectedPlan.name} Plan</h2>

            <div className='flex gap-4 justify-between '>
                <div className="bg-white p-6 ">
                    <h3 className="text-xl font-bold mb-4">Plan Summary</h3>
                    <p className="text-lg mb-4">Plan: {selectedPlan.name}</p>
                    <p className="text-lg mb-2">Price: <b>{billingInterval === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}</b></p>
                    <p className="mb-2">Billing Interval: <b>{billingInterval}</b></p>
                    <p className="mb-2">Resolution: <b>{selectedPlan.resolution}</b> </p>
                    <p className="mb-2">Video Quality: <b>{selectedPlan.videoQuality}</b> </p>
                    <p className="mb-2">Devices: <b>{selectedPlan.devices.toString()}</b> </p>
                    <p className="mb-2">Screens: <b>{selectedPlan.screens}</b> </p>
                </div>
                <div>


                    <form onSubmit={handleSubmit} className='w-[20vw]'>
                        <div className="mb-4">
                            <label htmlFor="card-element" className="block mb-2">
                                Card Details
                            </label>
                            <div id="card-element" className="p-2 border rounded bg-slate-100">
                                <div className='mb-4'>
                                    <label htmlFor="cardNumber" className="block mb-2 text-left">
                                        Card Number
                                    </label>
                                    <div id="cardNumber" className="p-2 border rounded bg-white">
                                        <CardNumberElement options={cardElementOptions} />
                                    </div>

                                </div>

                                <div className="mb-4">
                                    <label htmlFor="cardExpiry" className="block mb-2 text-left">
                                        Expiry Date
                                    </label>
                                    <div id="cardExpiry" className="p-2 border rounded bg-white">
                                        <CardExpiryElement options={cardElementOptions} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="cardCvc" className="block mb-2 text-left">
                                        CVC
                                    </label>
                                    <div id="cardCvc" className="p-2 border rounded bg-white">
                                        <CardCvcElement options={cardElementOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center justify-center'>


                            <button
                                type='submit'
                                className={`px-4 py-2 bg-blue-500 text-white rounded-full transition-all duration-300 hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-full  hover:bg-gray-600  transition-all duration-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
