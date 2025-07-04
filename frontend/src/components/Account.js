
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Account() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/info`,
                    {
                        withCredentials: true,    // ← include session cookie
                    });
                setUserInfo(res.data);
            } catch (err) {
                console.error('Error fetching user info:', err);

                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                    setError('Please login first.');
                } else {
                    setError('Unable to load account info.');
                }
            }
        }
        fetchUserInfo();
    }, []);

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '20px' }}>
                <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>Account Info</h1>
                <p className='text-red-500 text-base'>{error}</p>
            </div>
        );
    }

    if (!userInfo) return <div>Loading...</div>;

    // Helper to check if a given contest-type name is in the user's preferences
    const hasPref = typeName =>
        userInfo.preferences.some(pref => pref.name === typeName);

    return (
        <div className='px-3 ml-5'>
            <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>Account Info</h1>
            <p className='text-base font-normal text-gray-500 lg:text-lg sm:6 xl:dark:text-gray-400'><strong>Name:</strong>  {userInfo.name}</p>
            <p className='text-base font-normal text-gray-500 lg:text-lg sm:6 xl:dark:text-gray-400'><strong>Email:</strong> {userInfo.email}</p>

            <h3 className='mb-4 py-2 text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white'>Reminder Preferences</h3>
            <ul className='text-base font-normal text-gray-500 lg:text-lg sm:6 xl:dark:text-gray-400'>
                <li>
                    LeetCode Weekly: {hasPref('Weekly') ? 'Yes' : 'No'}
                </li>
                <li>
                    LeetCode Biweekly: {hasPref('Biweekly') ? 'Yes' : 'No'}
                </li>
                <li>
                    Codeforces Div1: {hasPref('Div1') ? 'Yes' : 'No'}
                </li>
                <li>
                    Codeforces Div2: {hasPref('Div2') ? 'Yes' : 'No'}
                </li>
                <li>
                    Codeforces Div3: {hasPref('Div3') ? 'Yes' : 'No'}
                </li>
                <li>
                    Codeforces Div4: {hasPref('Div4') ? 'Yes' : 'No'}
                </li>
            </ul>
            <p className='text-base font-normal text-gray-500 lg:text-lg sm:6 xl:dark:text-gray-400 my-5 inline mr-3'> Log out at:
            </p>
            <button onClick={() => navigate('/login')}
                className='text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
                Go to Logout Page</button>
        </div>
    );
}

export default Account;
