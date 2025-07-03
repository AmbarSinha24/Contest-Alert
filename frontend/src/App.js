

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Login from './components/Login';
import Preferences from './components/Preferences';
import Contests from './components/Contests';
import Account from './components/Account';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/info`, { withCredentials: true });
                setUser(res.data);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <Router>
            <Navbar user={user} />

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
            <Footer />
        </Router>
    );
}

export default App;
