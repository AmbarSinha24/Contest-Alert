import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Login() {
    const [user, setUser] = useState(null); // null = not logged in
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                // Check if user is logged in
                const res = await axios.get('http://localhost:5001/api/user/info', {
                    withCredentials: true
                });
                setUser(res.data); // e.g. { name, email, reminderPreferences }
            } catch (error) {
                // If 401 or user not found, user = null
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            // Passport >= 0.6.0 requires a callback in req.logout
            await axios.get('http://localhost:5001/auth/logout', {
                withCredentials: true
            });
            // Clear user from state
            setUser(null);
            // Show success message
            setMessage('Signed out successfully.');
        } catch (error) {
            console.error("Logout failed:", error);
            setMessage('Error signing out. Please try again.');
        }
    };

    return (
        <div className='px-3 ml-5'>
            <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>Login</h1>

            {/* If user is not logged in, show "Login with Google" */}
            {!user && (
                <>
                    <p className='mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:6 xl: dark:text-gray-400'>Click the button below to log in with Google.</p>
                    <a href="http://localhost:5001/auth/google">
                        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"'>
                            Login with Google
                        </button>
                    </a>
                </>
            )}

            {/* If user is logged in, show "Already logged in" + sign out button */}
            {user && (
                <>
                    <p className='mb-6 text-base font-normal text-gray-500 lg:text-lg  xl: dark:text-gray-400'>Already logged in as: <strong>{user.email}</strong></p>
                    <button className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'

                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>
                </>
            )}

            {/* If there's a message, show it below the login/sign-out section */}
            {message && (
                <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
            )}
        </div>
    );
}

export default Login;

