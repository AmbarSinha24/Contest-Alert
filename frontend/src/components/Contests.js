import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Contests() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMsg, setUpdateMsg] = useState('');

    // Fetch contests on component mount
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/contests');
                setContests(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contests:", error);
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const updateContests = async () => {
        try {
            await axios.post('http://localhost:5001/api/updateContests');
            // Re-fetch contests after update
            const response = await axios.get('http://localhost:5001/api/contests');
            setContests(response.data);
            setUpdateMsg('Contests updated successfully!');
            console.log("📢 Updated Contest List:");
            response.data.forEach((contest, i) => {
                console.log(`\n#${i + 1}`);
                console.log(`Name: ${contest.name}`);
                console.log(`Platform: ${contest.Platform?.name || contest.platform}`);
                console.log(`Start Time: ${new Date(contest.startTime * 1000).toLocaleString()}`);
                console.log(`Duration: ${Math.floor(contest.duration / 60)} minutes`);
            });
        } catch (error) {
            console.error("Error updating contests:", error);
            setUpdateMsg('Error updating contests.');
        }
    };

    return (
        <div className='px-3'>
            <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>Upcoming Contests</h1>
            <button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={updateContests} style={{ padding: '10px 20px' }}>
                Update Contests
            </button>
            {updateMsg && <p>{updateMsg}</p>}
            {loading ? (
                <p>Loading contests...</p>
            ) : (
                <div>
                    {contests.map((contest, index) => (

                        < div
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                margin: '10px 0',
                                padding: '10px'
                            }}
                        >
                            <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{contest.name}</h2>
                            <p className='font-normal text-gray-700 dark:text-gray-400'>
                                <strong>Platform:</strong> {contest.Platform?.name || 'Unknown'}
                            </p>
                            <p className='font-normal text-gray-700 dark:text-gray-400'>
                                <strong>Start Time:</strong>{' '}
                                {new Date(contest.startTime * 1000).toLocaleString()}
                            </p>
                            <p className='font-normal text-gray-700 dark:text-gray-400'>
                                <strong>Duration:</strong> {Math.floor(contest.duration / 60)} minutes
                            </p>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

export default Contests;
