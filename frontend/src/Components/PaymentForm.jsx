import React from 'react';
import axios from 'axios';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../constants'

const PaymentForm = ({ selectedPlan, billingInterval, onClose }) => {


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
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(selectedPlan._id)

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        // Create a PaymentMethod using the CardElement
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
        });

        if (error) {
            console.error(error.message);

        } else {

            const paymentMethodId = paymentMethod.id;

            try {
                const response = await axios.post(`${api}/subscription/subscribe`, {
                    paymentMethodId,
                    planId: selectedPlan._id,
                    userId: "64cdeb9f17fa7426bde48916",
                    billingInterval
                });
                const data = response.data;
                setStatus(data.status);
            } catch (error) {
                console.error('Error calling API:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Subscribe to {selectedPlan.name}</h2>
            <form onSubmit={handleSubmit}>
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
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-full"
                    >
                        Conform Payment
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-full">
                        Cancel
                    </button>
                </div>
            </form>
            <div >
                <p>plan: {selectedPlan.name}</p>
                <p>price: {selectedPlan.price}</p>
                <p>status: {status}</p>
                <p>BillingInterval: {billingInterval}</p>

            </div>
        </div>
    );
};

export default PaymentForm;
