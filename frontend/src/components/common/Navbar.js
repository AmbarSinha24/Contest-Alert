import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDark, setIsDark] = useState(() => {
        // Default to dark unless user has explicitly chosen light
        return localStorage.getItem('theme') !== 'light';
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
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-teal-400 font-bold px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 border-b-4 border-b-slate-900 dark:border-b-teal-500 -translate-y-[2px] transition-all duration-200'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 font-semibold px-6 py-3 rounded-xl border border-transparent border-b-4 border-b-transparent transition-all duration-200';
    };

    return (
        <nav className="flex items-center justify-between py-5 px-8 my-6 rounded-3xl bg-slate-50/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <img
                    src={assets.icon}
                    alt="Contest Alert icon"
                    className="w-10 h-10 rounded-xl shadow-sm object-cover"
                />
                <span className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Contest Alert
                </span>
            </div>

            {/* Centered nav items */}
            <ul className="hidden md:flex items-center gap-2 text-sm">
                <li><Link to="/" className={activeClass('/')}>HOME</Link></li>
                <li><Link to="/preferences" className={activeClass('/preferences')}>PREFERENCES</Link></li>
                <li><Link to="/contests" className={activeClass('/contests')}>CONTESTS</Link></li>
            </ul>

            {/* Right-aligned Account & Theme Toggle */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow transition-all duration-300 transform active:scale-95"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? (
                        // Sun Icon
                        <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-2.293a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm2.293-5.707a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" fillRule="evenodd" />
                        </svg>
                    ) : (
                        // Moon Icon
                        <svg className="w-5 h-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                {/* Account link */}
                {user ? (
                    <Link
                        to="/account"
                        title={user.email}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 text-white dark:text-slate-900 font-display font-bold text-sm shadow-sm hover:opacity-90 transition-opacity duration-200"
                    >
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="py-2.5 px-5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all duration-300"
                    >
                        LOG IN
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
