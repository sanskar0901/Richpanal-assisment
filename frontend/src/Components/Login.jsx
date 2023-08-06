import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import axios from 'axios';
import { api } from '../constants'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        if (cookie.get('isLoggedIn') === 'true') {
            navigate('/dashboard');
        }
    })
    const handleLogin = () => {
        axios.post(`${api}/user/login`, {
            email,
            password,
        }).then((res) => {
            console.log(res.data)
            cookie.set('isLoggedIn', 'true');
            cookie.set('userId', res.data.userId);
            cookie.set('userName', res.data.name);
            navigate('/dashboard');
            toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }).catch((err) => {
            console.log(err);
            toast.error('Login failed. Please check your credentials.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        })
    };

    return (
        <div
            className="h-screen flex items-center justify-center
                    bg-gradient-to-t from-blue-300 to-blue-400"
        >
            <div
                className="bg-white bg-opacity-40 backdrop-blur-lg
                        rounded-lg shadow-lg p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4">Login</h2>
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
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full w-full hover:bg-blue-600"
                >
                    Login
                </button>
                <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 font-bold hover:underline">
                        Signup
                    </Link>{' '}
                    now
                </p>
            </div>
        </div>
    );
};

export default Login;
