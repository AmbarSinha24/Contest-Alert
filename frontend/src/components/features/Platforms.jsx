import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Platforms = () => {
    const navigate = useNavigate();
    
    return (
        <div id="speciality" className="flex flex-col items-center gap-6 py-16 px-6 my-8 max-w-7xl mx-auto rounded-3xl bg-white/85 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Supported Coding Platforms
            </h2>
            <p className="sm:w-1/2 text-center text-slate-600 dark:text-slate-350 text-base leading-relaxed">
                Stay updated with schedules from top-tier competitive sites. Sync directly to your Google Calendar.
            </p>
            
            <div className="flex justify-center gap-8 pt-8 w-full max-w-lg">
                {/* Codeforces Platform Card */}
                <div className="relative group p-[1.5px] rounded-2xl bg-slate-200/60 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-400 dark:hover:from-teal-500 dark:hover:to-cyan-300 transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none flex-grow">
                    <Link
                        to="/contests"
                        onClick={() => window.scrollTo(0, 0)}
                        className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-[15px] p-6 cursor-pointer transition-colors duration-300"
                    >
                        <img className="w-16 sm:w-20 mb-3 filter dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-110" src={assets.cficon} alt="CodeForces logo" />
                        <p className="font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-200">CodeForces</p>
                    </Link>
                </div>

                {/* Leetcode Platform Card */}
                <div className="relative group p-[1.5px] rounded-2xl bg-slate-200/60 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-400 dark:hover:from-teal-500 dark:hover:to-cyan-300 transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none flex-grow">
                    <Link
                        to="/contests"
                        onClick={() => window.scrollTo(0, 0)}
                        className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-[15px] p-6 cursor-pointer transition-colors duration-300"
                    >
                        <img className="w-16 sm:w-20 mb-3 filter dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-110" src={assets.lcicon} alt="LeetCode logo" />
                        <p className="font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-200">LeetCode</p>
                    </Link>
                </div>
            </div>

            <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-200">Start Today!!</h3>
            <button 
                onClick={() => navigate('/login')}
                className="text-white font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-teal-500 dark:to-teal-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-teal-500/10 active:scale-95 transition-all duration-300 rounded-2xl text-sm px-8 py-3 text-center"
            >
                Join Us
            </button>
        </div>
    )
}

export default Platforms