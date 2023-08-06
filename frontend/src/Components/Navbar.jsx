import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = cookie.get('isLoggedIn');
    const location = useLocation();
    const handleLogout = () => {
        cookie.remove('isLoggedIn');
        cookie.remove('userName');
        cookie.remove('userId');
        navigate('/');
    }
    return (
        <nav className="bg-blue-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
                <div className="mr-4 text-lg font-bold">RICHPANEL</div>
                {isLoggedIn && <div className="mr-4">Hello, {cookie.get('userName')}</div>}
            </div>
            <div>
                {!isLoggedIn ? (
                    <div className="flex items-center">
                        {location.pathname !== '/signup' && (
                            <Link to="/signup" className="px-4 py-2 bg-blue-500 text-white rounded-full mr-4">
                                Sign Up
                            </Link>
                        )}
                        {location.pathname !== '/' && (
                            <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-full">
                                Login
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className='flex gap-4'>
                        <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-full transition-all duration-300 hover:bg-blue-600">
                            Dashboard
                        </Link>
                        <button className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-300" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
