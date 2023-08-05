import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import { api } from '../constants';
const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        axios.post(`${api}/user/register`, {
            name,
            email,
            password,
        })
            .then((res) => {
                console.log(res.data)
                cookie.set('isLoggedIn', 'true');
                cookie.set('userId', res.data.user._id);
                cookie.set('userName', res.data.user.name);
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-300">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border rounded mb-2"
            />
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
            <p>Already have  account? <Link to="/" className="text-blue-500">Login</Link> now</p>
        </div>
    );
};

export default Signup;
