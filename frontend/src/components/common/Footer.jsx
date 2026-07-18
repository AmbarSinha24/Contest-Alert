import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className="border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
            <footer className="max-w-7xl mx-auto py-12 px-6">
                <div className="md:flex md:justify-between gap-8">
                    <div className="mb-8 md:mb-0">
                        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
                            <img
                                src={assets.icon}
                                alt="Contest Alert icon"
                                className="w-8 h-8 rounded-xl object-cover"
                            />
                            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Contest Alert
                            </span>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                            Aggregating programming contests so you never miss a start time.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-teal-400">Product</h4>
                            <ul className="text-sm font-semibold space-y-2.5 text-slate-650 dark:text-slate-350">
                                <li><Link to="/contests" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Contests</Link></li>
                                <li><Link to="/preferences" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Preferences</Link></li>
                                <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Calendar sync</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-teal-400">Company</h4>
                            <ul className="text-sm font-semibold space-y-2.5 text-slate-650 dark:text-slate-350">
                                <li><a href="https://github.com/AmbarSinha24" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">About</a></li>
                                <li><a href="https://www.linkedin.com/in/ambar-sinha-b90249206/" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-teal-400">Legal</h4>
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
                </div>
            </footer>
        </div>
    )
}

export default Footer