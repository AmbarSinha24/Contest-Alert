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
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    ) : (
                        // Moon Icon
                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
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
