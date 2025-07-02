

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Preferences() {
    const [allTypes, setAllTypes] = useState([]);       // All possible contest types
    const [selectedIds, setSelectedIds] = useState(new Set()); // User’s selected type IDs
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Fetch contest types and user’s current preferences
    useEffect(() => {
        async function init() {
            try {
                const [typesRes, prefsRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/contest-types', { withCredentials: true }),
                    axios.get('http://localhost:5001/api/user/preferences', { withCredentials: true })
                ]);
                setAllTypes(typesRes.data);
                // prefsRes.data is an array of { id, name } for subscribed types
                setSelectedIds(new Set(prefsRes.data.map(t => t.id)));
            } catch (err) {
                console.error('Error initializing preferences:', err);
                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                    setError('Please log in first.');
                } else {
                    setError('Failed to load preferences.');
                }
            }
        }
        init();
    }, []);

    // Toggle a contest-type ID in the Set
    const toggle = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Submit updated list of IDs
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5001/api/user/preferences',
                { contestTypeIds: Array.from(selectedIds) },
                { withCredentials: true }
            );
            setMessage('Preferences updated successfully.');
            setError('');
        } catch (err) {
            console.error('Error updating preferences:', err);
            if (err.response?.status === 401) {
                setIsLoggedIn(false);
                setError('Please log in first.');
            } else {
                setError('Error updating preferences.');
            }
            setMessage('');
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>User Preferences</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (error && allTypes.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>User Preferences</h1>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (allTypes.length === 0) {
        return <div>Loading preferences...</div>;
    }

    return (
        <div className='px-3 ' >
            <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>User Preferences</h1>
            <form onSubmit={handleSubmit}>
                {allTypes.map((type) => (
                    <div key={type.id} style={{ marginBottom: '0.75rem' }}>
                        <label className='inline-flex items-center gap-2'>
                            <input
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                type="checkbox"
                                checked={selectedIds.has(type.id)}
                                onChange={() => toggle(type.id)}
                            />

                            <span className='text-base font-normal text-gray-500 lg:text-lg sm:6 xl:dark:text-gray-400'>
                                {type.name}
                            </span>
                        </label>
                    </div>
                ))}

                <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                    type="submit" >
                    Update Preferences
                </button>
            </form>

            {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
            {error && <p style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Preferences;
