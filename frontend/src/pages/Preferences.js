

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Preferences() {
    const [allTypes, setAllTypes] = useState([]);       // All possible contest types
    const [selectedIds, setSelectedIds] = useState(new Set()); // User’s selected type IDs
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Fetch contest types and user’s current preferences
    useEffect(() => {
        let ignore = false;
        
        const cachedTypes = sessionStorage.getItem('contest_types');
        const cachedPrefs = sessionStorage.getItem('user_preferences');
        
        if (cachedTypes && cachedPrefs) {
            setAllTypes(JSON.parse(cachedTypes));
            setSelectedIds(new Set(JSON.parse(cachedPrefs)));
        }

        async function init() {
            try {
                const [typesRes, prefsRes] = await Promise.all([
                    api.get('/api/contest-types'),
                    api.get('/api/user/preferences')
                ]);
                if (ignore) return;
                
                setAllTypes(typesRes.data);
                const prefsIds = prefsRes.data.map(t => t.id);
                setSelectedIds(new Set(prefsIds));
                
                sessionStorage.setItem('contest_types', JSON.stringify(typesRes.data));
                sessionStorage.setItem('user_preferences', JSON.stringify(prefsIds));
            } catch (err) {
                console.error('Error initializing preferences:', err);
                if (ignore) return;
                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                    setError('Please log in first.');
                } else {
                    setError('Failed to load preferences.');
                }
            }
        }
        init();
        return () => { ignore = true; };
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
            const prefsIds = Array.from(selectedIds);
            await api.post(
                '/api/user/preferences',
                { contestTypeIds: prefsIds }
            );
            sessionStorage.setItem('user_preferences', JSON.stringify(prefsIds));
            sessionStorage.removeItem('user_info'); // Force Account page to fetch updated user preferences
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
            <div className="flex justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5 text-2xl">
                        🔒
                    </div>
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Sign in required</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
                    <a href="/login" className="inline-block bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-all">Continue to login</a>
                </div>
            </div>
        );
    }

    if (error && allTypes.length === 0) {
        return (
            <div className="flex justify-center py-12 px-4">
                <div className="max-w-md w-full bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl text-center">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (allTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <div className="animate-pulse">Loading preferences...</div>
            </div>
        );
    }

    const isCadence = (name) => name === 'Weekly' || name === 'Biweekly';
    const cadenceTypes = allTypes.filter(t => isCadence(t.name));
    const divisionTypes = allTypes.filter(t => !isCadence(t.name));

    const ToggleRow = ({ type }) => {
        const isChecked = selectedIds.has(type.id);
        return (
            <div
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200"
            >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {type.name}
                </span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isChecked}
                    onClick={() => toggle(type.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 dark:focus:ring-teal-500/25 ${
                        isChecked ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-xl mx-auto my-8">
            <div className="bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl transition-colors duration-300">
                <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Alert preferences
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Choose which contests trigger email alerts and Google Calendar events.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {cadenceTypes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">LeetCode</h3>
                            <div className="grid grid-cols-1 gap-2.5">
                                {cadenceTypes.map((type) => <ToggleRow key={type.id} type={type} />)}
                            </div>
                        </div>
                    )}

                    {divisionTypes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Codeforces</h3>
                            <div className="grid grid-cols-1 gap-2.5">
                                {divisionTypes.map((type) => <ToggleRow key={type.id} type={type} />)}
                            </div>
                        </div>
                    )}

                    <button
                        className="w-full text-white font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300 rounded-2xl text-sm py-3.5 px-6 text-center"
                        type="submit"
                    >
                        Save preferences
                    </button>
                </form>

                {message && (
                    <div className="mt-6 text-center py-2.5 px-4 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 text-center py-2.5 px-4 rounded-xl text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/30">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Preferences;
