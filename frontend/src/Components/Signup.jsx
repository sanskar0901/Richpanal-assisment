import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
                toast.error(err.response.data.message);
            })
    }

    return (
        <div
            className="h-screen flex items-center justify-center
            bg-gradient-to-t from-blue-300 to-blue-400"
        >
            <div
                className="bg-white bg-opacity-40 backdrop-blur-lg
                        rounded-lg shadow-lg p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                <input
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 border rounded mb-2 w-full"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 border rounded mb-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 border rounded mb-4 w-full"
                />

                <button
                    onClick={handleSignup}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full w-full hover:bg-blue-600"
                >
                    Signup
                </button>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-500 font-bold hover:underline">
                        Login
                    </Link>{' '}
                    now
                </p>
            </div>
        </div>
    );
};

export default Signup;
