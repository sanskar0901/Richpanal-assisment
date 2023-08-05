import React, { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import axios from 'axios';
import { api } from '../constants';
import { useNavigate } from 'react-router-dom';
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

    // Function to calculate the time left in the expiration of the plan
    const getTimeLeft = (expirationDate) => {
        const currentDate = new Date();
        const expiryDate = new Date(expirationDate);
        const timeDiff = expiryDate - currentDate;
        const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return remainingDays;
    };

    return (
        <div>

            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Dashboard!</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {plansData.map((plan) => (
                        <div key={plan.id} className="border p-4 rounded-md">
                            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                            <p>Price: {plan.price}</p>
                            <p>Duration: {plan.duration}</p>
                            <p>Video Quality: {plan.videoQuality}</p>
                            {/* Display the time left in the expiration of the plan */}
                            {plan.expirationDate && (
                                <p>Expires in: {getTimeLeft(plan.expirationDate)} days</p>
                            )}
                            {/* Add any other plan details you want to display */}
                        </div>
                    ))}
                </div>
            </div >

        </div>
    );
};

export default Dashboard;
