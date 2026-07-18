import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const scrollToPlatforms = () => {
        document.getElementById('speciality')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="text-center pt-12 pb-6 px-4 max-w-5xl mx-auto transition-colors duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 dark:text-teal-400 bg-indigo-50 dark:bg-slate-800/60 rounded-full uppercase">
                ⚡ Live Aggregator
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mt-6 leading-[1.1] tracking-tight">
                Never miss a <br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 dark:from-teal-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
                    coding contest
                </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
                Set custom preferences, browse upcoming contests from every major platform, and sync straight to your Google Calendar.
            </p>
            
            <div className="mt-8">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/contests')}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-teal-500/15 transition-all duration-300"
                    >
                        View Contests
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollToPlatforms}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold px-8 py-3.5 rounded-2xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all duration-300"
                    >
                        How it works
                    </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium tracking-wide">
                    Free — no signup required to browse contests
                </p>
            </div>

            {/* 3-Step "How it works" Feature Strip */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                <div className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg mb-4 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
                        🔍
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">1. Browse Contests</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Access real-time schedules for Codeforces and LeetCode contests directly on our dashboard.
                    </p>
                </div>
                <div className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg mb-4 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
                        ⚙️
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">2. Filter Preferences</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Sign in to set your preferred divisions (Div 1–4) or contest frequencies to get targeted alerts.
                    </p>
                </div>
                <div className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg mb-4 shadow-sm border border-slate-200/30 dark:border-slate-700/30">
                        ⏰
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">3. Automate Sync</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Receive calendar invitations and direct email alerts 20 minutes before each matched contest start.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Header
