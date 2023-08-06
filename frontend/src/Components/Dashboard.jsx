import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { api } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Dashboard = () => {
    const [plansData, setPlansData] = useState([]);
    const navigate = useNavigate();
    const user_id = cookie.get('userId');
    useEffect(() => {
        if (cookie.get('isLoggedIn') !== 'true') {
            navigate('/');
        }
        axios.get(`${api}/subscription/get/${user_id}`).then((res) => {
            setPlansData(res.data.plans);
            console.log(res.data);
        }).catch((error) => {
            console.error('Error fetching plans:', error);
        })
    }, []);

    const getTimeLeft = (expirationDate) => {
        const currentDate = new Date();
        const expiryDate = new Date(expirationDate);
        const timeDiff = expiryDate - currentDate;
        const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return remainingDays;
    };
    const handleCancle = ((e, subscriptionId) => {
        e.preventDefault();
        window.confirm('Are you sure you want to cancel your subscription?') &&
            axios.post(`${api}/subscription/cancel`, { subscriptionId }).then((res) => {
                setPlansData(res.data.plans);
                console.log(res.data);
                toast.success('Subscription canceled successfully');
                window.location.reload();
            }
            ).catch((error) => {
                console.error('Error fetching plans:', error);
            })
    })


    return (
        <div>

            <Navbar />
            <div className='px-16 py-8'>
                {plansData === undefined || plansData.length === 0 ? <>
                    <h2 className="text-3xl font-bold mb-16 text-center">Add Plans</h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <Link to="/plans" className="border p-4 rounded-md bg-gray-200 flex flex-col items-center justify-center hover:bg-gray-300 h-[40vh]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a1 1 0 01-1-1V11H2a1 1 0 010-2h7V2a1 1 0 012 0v7h7a1 1 0 010 2h-7v6a1 1 0 01-1 1z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-blue-500 font-bold">Buy Plans</span>
                        </Link>
                    </div></> :
                    <div>
                        <h2 className="text-3xl font-bold mb-16 text-center">Subscribed Plans</h2>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {plansData.map((plan) => (
                                <div key={plan._id} className="border p-4 rounded-md bg-slate-400">
                                    <h3 className="text-lg font-bold mb-2 text-center">{plan.name}</h3>
                                    <p>Price: {plan.billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}</p>
                                    <p>Duration: {plan.billingInterval}</p>
                                    <p>Video Quality: {plan.videoQuality}</p>
                                    {plan.expDate && (
                                        <p>Expires in: <b>{getTimeLeft(plan.expDate)} days</b></p>
                                    )}
                                    <p>Devices: {plan.devices.toString()}</p>
                                    <p>Screens: {plan.screens}</p>
                                    <center>

                                        <button className='px-4 py-2 bg-red-500 text-white rounded-full' onClick={(e) => handleCancle(e, plan.subscriptionId)}>
                                            Cancle</button>
                                    </center>

                                </div>
                            ))}
                            <Link to="/plans" className="border p-4 rounded-md bg-gray-200 flex flex-col items-center justify-center hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a1 1 0 01-1-1V11H2a1 1 0 010-2h7V2a1 1 0 012 0v7h7a1 1 0 010 2h-7v6a1 1 0 01-1 1z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 text-blue-500 font-bold">Buy Plans</span>
                            </Link>
                        </div>
                    </div>
                }
            </div>
        </div >
    );
};

export default Dashboard;
