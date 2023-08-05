import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [plansData, setPlansData] = useState([]);

    useEffect(() => {
        axios.get(`${api}/plans/${user_id}`).then((res) => {
            setPlansData(res.data);
            console.log(res.data);
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
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h2>
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
        </div>
    );
};

export default Dashboard;
