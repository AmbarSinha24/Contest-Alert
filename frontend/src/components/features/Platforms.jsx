import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Platforms = () => {
    const navigate = useNavigate();
    
    const platforms = [
        {
            banner: assets.cfbanner,
            bannerBg: 'bg-white',
            name: 'CodeForces',
            subtitle: 'Div 1–4 rounds',
            alt: 'CodeForces logo'
        },
        {
            banner: assets.lcbanner,
            bannerBg: 'bg-black',
            name: 'LeetCode',
            subtitle: 'Weekly & biweekly',
            alt: 'LeetCode logo'
        },
    ];

    return (
        <div id="speciality" className="max-w-4xl mx-auto mb-6 px-4">
            <div className="bg-blue-50/70 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800/80 rounded-2xl px-8 py-8 shadow-sm dark:shadow-none transition-colors duration-300">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white mb-1">Currently supporting</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sync upcoming contests straight to Google Calendar.</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="self-start sm:self-auto flex-shrink-0 text-white text-sm font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 hover:opacity-90 active:scale-95 transition-all duration-200 rounded-xl px-6 py-2.5 shadow-sm"
                    >
                        Get Started
                    </button>
                </div>

                {/* Platform cards */}
                <div className="flex gap-4">
                    {platforms.map((p) => (
                        <Link
                            key={p.name}
                            to="/contests"
                            onClick={() => window.scrollTo(0, 0)}
                            className="group flex flex-col flex-1 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-teal-500/50 hover:shadow-lg transition-all duration-200"
                        >
                            {/* Banner image area */}
                            <div className={`flex items-center justify-center ${p.bannerBg} px-6 py-7 group-hover:opacity-90 transition-opacity duration-200`}>
                                <img
                                    className="w-full max-h-20 object-contain group-hover:scale-105 transition-transform duration-200"
                                    src={p.banner}
                                    alt={p.alt}
                                />
                            </div>
                            {/* Text — pinned to bottom */}
                            <div className="px-5 py-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60">
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Platforms