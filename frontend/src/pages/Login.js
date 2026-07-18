import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Login() {
    const [user, setUser] = useState(null); // null = not logged in
    const [message, setMessage] = useState('');

    useEffect(() => {
        let ignore = false;
        async function fetchUser() {
            try {
                const res = await api.get('/api/user/info');
                if (!ignore) setUser(res.data);
            } catch (error) {
                if (!ignore) setUser(null);
            }
        }
        fetchUser();
        return () => { ignore = true; };
    }, []);

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
            setMessage('Signed out successfully.');
        } catch (error) {
            console.error("Logout failed:", error);
            setMessage('Error signing out. Please try again.');
        }
    };

    if (user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl transition-colors duration-300 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-teal-500 flex items-center justify-center text-white dark:text-slate-900 text-2xl font-display font-bold mx-auto mb-5">
                        {user.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">Account</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your integrations and preferences.</p>

                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 mb-5 text-left">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Signed in as</p>
                        <p className="font-display font-bold text-slate-900 dark:text-slate-100">{user.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold px-6 py-3.5 rounded-2xl active:scale-[0.98] transition-all duration-300 text-sm"
                    >
                        Sign out
                    </button>

                    {message && (
                        <div className="mt-5 text-center py-2.5 px-4 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full flex flex-col sm:flex-row rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/80">
                <div className="flex-1 bg-gradient-to-br from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 p-8 sm:p-10 text-white">
                    <h2 className="font-display text-2xl font-bold mb-5">Sign in to sync everything</h2>
                    <div className="space-y-3.5 text-sm">
                        <div className="flex gap-2.5 items-start">
                            <span className="mt-0.5">✓</span>
                            <span>Auto-add contests to your Google Calendar</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                            <span className="mt-0.5">✓</span>
                            <span>Get reminders before start time</span>
                        </div>
                        <div className="flex gap-2.5 items-start">
                            <span className="mt-0.5">✓</span>
                            <span>Save platform &amp; difficulty preferences</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50/90 dark:bg-slate-900 p-8 sm:p-10 flex flex-col justify-center">
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Continue with your Google account.</p>
                    <a
                        href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
                        className="inline-flex w-full items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300 transform active:scale-[0.98] text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" fillRule="evenodd" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" fillRule="evenodd" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </a>
                    <p className="mt-5 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                        By continuing you agree to our Terms of Service and Privacy Policy.
                    </p>
                    {message && (
                        <div className="mt-5 text-center py-2.5 px-4 rounded-xl text-sm bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;

