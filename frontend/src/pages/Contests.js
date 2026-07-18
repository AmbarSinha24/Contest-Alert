import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Contests() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMsg, setUpdateMsg] = useState('');
    const [updating, setUpdating] = useState(false);

    // Fetch contests on component mount
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await api.get('/api/contests');
                setContests(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contests:", error);
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const handleAddToCalendar = async (contestId) => {
        try {
            const res = await api.post(`/api/add-to-calendar/${contestId}`);
            alert(res.data.message);
        } catch (err) {
            console.error(err);
            alert('Failed to add to calendar');
        }
    };

    const updateContests = async () => {
        setUpdating(true);
        setUpdateMsg('');
        try {
            await api.post('/api/updateContests');
            const response = await api.get('/api/contests');
            setContests(response.data);
            setUpdateMsg('Contests updated successfully!');
        } catch (error) {
            console.error("Error updating contests:", error);
            setUpdateMsg('Error updating contests.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-4 px-2">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Upcoming contests
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Check the ones you want, then sync them to your calendar in one go.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={updateContests}
                        disabled={updating}
                        className={`text-white font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-teal-500 dark:to-teal-600 hover:opacity-90 shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300 rounded-2xl text-sm px-6 py-3.5 text-center flex items-center justify-center gap-2 ${
                            updating ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {updating ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                            </svg>
                        )}
                        Sync Platforms
                    </button>
                </div>
            </div>

            {updateMsg && (
                <div className="mb-6 py-3 px-4 text-center rounded-2xl text-sm bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-teal-400 border border-indigo-100/50 dark:border-indigo-900/30">
                    {updateMsg}
                </div>
            )}

            {/* Main Content */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px] text-slate-500 dark:text-slate-400 text-sm font-semibold">
                    <div className="animate-pulse">Loading upcoming contests...</div>
                </div>
            ) : contests.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/90 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
                    <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-200">No Contests Listed</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Click "Sync Platforms" to load upcoming contests from external sites.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map((contest, index) => {
                        const platform = contest.Platform?.name || 'Unknown';
                        const badgeColor = platform === 'LeetCode'
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20';

                        return (
                            <div 
                                key={index}
                                className="relative group p-[1.5px] rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-400 dark:hover:from-teal-500 dark:hover:to-cyan-300 shadow-md hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="rounded-[22px] bg-slate-50/90 dark:bg-slate-900 p-6 h-full flex flex-col justify-between transition-colors duration-300">
                                    <div>
                                        {/* Card Header: Platform Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                                                {platform}
                                            </span>
                                            {contest.ContestType?.name && (
                                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase">
                                                    {contest.ContestType.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Title */}
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-4 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                                            {contest.name}
                                        </h3>

                                        {/* Card Details */}
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-350 text-sm">
                                                {/* Calendar Icon */}
                                                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {new Date(contest.startTime * 1000).toLocaleDateString(undefined, {
                                                        weekday: 'short', month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-350 text-sm">
                                                {/* Clock Icon */}
                                                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    {new Date(contest.startTime * 1000).toLocaleTimeString(undefined, {
                                                        hour: 'numeric', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-350 text-sm">
                                                {/* Hourglass Icon */}
                                                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>
                                                    Duration: {Math.floor(contest.duration / 60)} minutes
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button 
                                        onClick={() => handleAddToCalendar(contest.id)}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-teal-400 font-bold px-4 py-3.5 rounded-2xl hover:bg-indigo-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-900 shadow-sm active:scale-[0.98] transition-all duration-300 text-xs mt-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Add to Calendar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Contests;
