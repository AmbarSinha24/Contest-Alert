import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();

    return (

        <nav className="relative flex items-center py-4 mb-5 border-b border-b-[#ADADAD]">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3">
                <img onClick={() => navigate('/')} src={assets.logo} className="ml-3 h-8 cursor-pointer" alt="Logo" />
                <span onClick={() => navigate('/')} className="text-2xl font-semibold whitespace-nowrap dark:text-white cursor-pointer">Contest Alert</span>
            </div>

            {/* Centered nav items */}
            <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-5 font-medium text-base capitalize">
                <li><Link to='/' className={`py-1 px-2 '}`}>HOME</Link></li>
                <li><Link to="/login" className={`py-1 px-2 '}`}>LOGIN</Link></li>
                <li><Link to="/preferences" className={`py-1 px-2 '}`}>PREFERENCES</Link></li>
                <li><Link to="/contests" className={`py-1 px-2 '}`}>CONTESTS</Link></li>
            </ul>

            {/* Right-aligned Account */}
            <ul className="ml-auto flex items-center gap-5 font-medium text-sm">
                <li><Link to="/account" className={`py-1 px-2 '}`}>ACCOUNT</Link></li>
            </ul>

        </nav>

    )
}

export default Navbar
