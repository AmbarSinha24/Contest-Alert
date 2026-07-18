import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const activeClass = (path) => {
        return location.pathname === path 
            ? 'text-indigo-600 dark:text-teal-400 font-bold border-b-2 border-indigo-600 dark:border-teal-400 pb-1'
            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors duration-200';
    };

    return (
        <nav className="flex items-center justify-between py-4 px-6 my-4 rounded-2xl bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            {/* Left: Custom SVG Logo and Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-teal-400 border border-indigo-100/30 dark:border-slate-700/30">
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Contest Alert
                </span>
            </div>

            {/* Centered nav items */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
                <li><Link to="/" className={activeClass('/')}>HOME</Link></li>
                <li><Link to="/login" className={activeClass('/login')}>LOGIN</Link></li>
                <li><Link to="/preferences" className={activeClass('/preferences')}>PREFERENCES</Link></li>
                <li><Link to="/contests" className={activeClass('/contests')}>CONTESTS</Link></li>
            </ul>

            {/* Right-aligned Account & Theme Toggle */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? (
                        // Sun Icon
                        <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-2.293a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm2.293-5.707a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" fillRule="evenodd" />
                        </svg>
                    ) : (
                        // Moon Icon
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                {/* Account link */}
                <Link 
                    to="/account" 
                    className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        location.pathname === '/account'
                            ? 'bg-indigo-600 dark:bg-teal-500 text-white shadow-lg shadow-indigo-600/30 dark:shadow-teal-500/20'
                            : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-teal-400 hover:bg-indigo-100 dark:hover:bg-slate-700'
                    }`}
                >
                    ACCOUNT
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
