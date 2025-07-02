
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Account() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const res = await axios.get('http://localhost:5001/api/user/info', {
                    withCredentials: true
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
                <h1>Account Info</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (!userInfo) return <div>Loading...</div>;

    // Helper to check if a given contest-type name is in the user's preferences
    const hasPref = typeName =>
        userInfo.preferences.some(pref => pref.name === typeName);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Account Info</h1>
            <p><strong>Name:</strong>  {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>

            <h3>Reminder Preferences</h3>
            <ul>
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
        </div>
    );
}

export default Account;
