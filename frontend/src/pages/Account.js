
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Account() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        async function fetchUserInfo() {
            try {
                const res = await api.get('/api/user/info');
                if (!ignore) setUserInfo(res.data);
            } catch (err) {
                console.error('Error fetching user info:', err);
                if (ignore) return;
                if (err.response?.status === 401) {
                    setIsLoggedIn(false);
                    setError('Please login first.');
                } else {
                    setError('Unable to load account info.');
                }
            }
        }
        fetchUserInfo();
        return () => { ignore = true; };
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            navigate('/login');
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
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{error || 'Log in with Google to view your account and preferences.'}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-block bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-all"
                    >
                        Continue to login
                    </button>
                </div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-slate-500 dark:text-slate-400 text-sm font-semibold">
                <div className="animate-pulse">Loading account info...</div>
            </div>
        );
    }

    const hasPref = typeName => userInfo.preferences.some(pref => pref.name === typeName);

    const PREFS_LIST = [
        { key: 'Weekly', label: 'LeetCode Weekly' },
        { key: 'Biweekly', label: 'LeetCode Biweekly' },
        { key: 'Div1', label: 'Codeforces Div 1' },
        { key: 'Div2', label: 'Codeforces Div 2' },
        { key: 'Div3', label: 'Codeforces Div 3' },
        { key: 'Div4', label: 'Codeforces Div 4' },
    ];

    return (
        <div className="max-w-xl mx-auto my-8">
            <div className="bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl transition-colors duration-300">

                {/* Profile Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-teal-500 flex items-center justify-center text-white dark:text-slate-900 text-xl font-display font-bold uppercase shadow-md">
                        {userInfo.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">{userInfo.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{userInfo.email}</p>
                    </div>
                </div>

                {/* Preferences Listing */}
                <div className="my-8">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
                        Alert Settings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PREFS_LIST.map((item, index) => {
                            const active = hasPref(item.key);
                            return (
                                <div 
                                    key={index} 
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                        active 
                                            ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/30' 
                                            : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800/80'
                                    }`}
                                >
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                                        {item.label}
                                    </span>
                                    {active ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                            Muted
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Account Actions */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => navigate('/preferences')}
                        className="flex-grow text-white font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-teal-500/10 active:scale-[0.98] transition-all duration-300 rounded-2xl text-sm py-3.5 px-6 text-center"
                    >
                        Edit Preferences
                    </button>
                    <button
                        onClick={handleLogout}
                        className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-300 rounded-2xl text-sm py-3.5 px-6 text-center"
                    >
                        Sign out
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Account;
