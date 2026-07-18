

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './services/api';

import Login from './pages/Login';
import Preferences from './pages/Preferences';
import Contests from './pages/Contests';
import Account from './pages/Account';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Footer from './components/common/Footer';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/user/info');
                setUser(res.data);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <Router>
            <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800 transition-colors duration-300 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 dark:text-slate-100 relative overflow-hidden">
                {/* Background ambient light blobs (dark mode only) */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] hidden dark:block bg-indigo-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] hidden dark:block bg-cyan-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-grow">
                    <Navbar user={user} />
                    <div className="py-6">
                        <Routes>
                            {/* The main login page */}
                            <Route path="/" element={<Home />} />

                            {/* Login Page*/}
                            <Route path="/login" element={<Login />} />

                            {/* Preferences page */}
                            <Route path="/preferences" element={<Preferences />} />

                            {/* Contests page */}
                            <Route path="/contests" element={<Contests />} />

                            {/* Account info page */}
                            <Route path="/account" element={<Account />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
