import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {

        cookie.set('isLoggedIn', 'true');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-300">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded mb-2"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded mb-4"
            />
            <button
                onClick={handleSignup}
                className="px-4 py-2 bg-blue-500 text-white rounded-full"
            >
                Signup
            </button>
        </div>
    );
};

export default Signup;
