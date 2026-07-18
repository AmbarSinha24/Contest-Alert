import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center py-16 px-4 my-8 max-w-4xl mx-auto transition-colors duration-300 font-sans">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 dark:text-teal-400 bg-indigo-50 dark:bg-slate-800/60 rounded-full uppercase">
                ⚡ Live Aggregator
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mt-6 leading-tight tracking-tight">
                Never Miss a <br />
                <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-teal-400 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-405 bg-clip-text text-transparent">
                    Coding Contest
                </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
                Set custom preferences, browse upcoming contests from multiple platforms, and synchronize events directly with your Google Calendar hassle-free.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <button 
                    onClick={() => navigate('/contests')} 
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-teal-500 dark:to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-teal-500/15 transition-all duration-300"
                >
                    View Contests
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Header
