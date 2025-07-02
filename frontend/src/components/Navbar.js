import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
const Navbar = () => {
    return (

        <nav className="relative flex items-center py-4 mb-5 border-b border-b-[#ADADAD]">

            {/* Centered nav items */}
            <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-5 font-medium text-base capitalize">
                <li><Link to="/" className="py-1 px-2 capitalize">LOGIN</Link></li>
                <li><Link to="/preferences" className="py-1 px-2 capitalize ">PREFERENCES</Link></li>
                <li><Link to="/contests" className="py-1 px-2 capitalize">CONTESTS</Link></li>
            </ul>

            {/* Right-aligned Account */}
            <ul className="ml-auto flex items-center gap-5 font-medium text-sm">
                <li><Link to="/account" className="py-1 pr-5 px-2 capitalize">ACCOUNT</Link></li>
            </ul>

        </nav>

    )
}

export default Navbar
