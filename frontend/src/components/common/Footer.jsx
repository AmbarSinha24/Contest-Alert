import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-20 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
            <footer className="max-w-7xl mx-auto py-12 px-6 font-sans">
                <div className="md:flex md:justify-between gap-8">
                    <div className="mb-8 md:mb-0">
                        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-teal-400 border border-indigo-100/30 dark:border-slate-700/30">
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                Contest Alert
                            </span>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                            Aggregating programming contests dynamically to keep you ahead of schedules and alerts.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resources</h4>
                            <ul className="text-sm font-semibold space-y-2.5 text-slate-650 dark:text-slate-350">
                                <li>
                                    <a href="https://react.dev/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">React</a>
                                </li>
                                <li>
                                    <a href="https://tailwindcss.com/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Tailwind CSS</a>
                                </li>
                                <li>
                                    <a href="https://nodejs.org/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Node.js</a>
                                </li>
                                <li>
                                    <a href="https://www.mongodb.com/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">MongoDB</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Connect</h4>
                            <ul className="text-sm font-semibold space-y-2.5 text-slate-650 dark:text-slate-350">
                                <li>
                                    <a href="https://github.com/AmbarSinha24" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">GitHub</a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/ambar-sinha-b90249206/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Legal</h4>
                            <ul className="text-sm font-semibold space-y-2.5 text-slate-650 dark:text-slate-350">
                                <li>
                                    <a href="#" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Terms of Service</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 sm:flex sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>© {new Date().getFullYear()} <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Contest Alert</span>. All rights reserved.</span>
                    <span className="mt-2 sm:mt-0 font-medium">Created by Ambar Sinha</span>
                </div>
            </footer>
        </div>
    )
}

export default Footer