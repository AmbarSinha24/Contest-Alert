import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Platforms = () => {
    const navigate = useNavigate();
    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-black  my-5 max-w-7xl mx-auto rounded-lg font-sans '>
            <h1 className='text-4xl font-medium font-bold'>Multiple Platforms at one Destination</h1>
            <p className='sm:w-1/3 text-center text-m'>Simply browse through the list of upcoming Contests, add it in your Google Calender hassle-free.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                <Link
                    to="/contests"
                    onClick={() => scrollTo(0, 0)}
                    className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                >
                    <img className="w-16 sm:w-24 mb-2" src={assets.cficon} alt="Cardiologist" />
                    <p>CodeForces</p>
                </Link>

                <Link
                    to="/contests"
                    onClick={() => scrollTo(0, 0)}
                    className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                >
                    <img className="w-16 sm:w-24 mb-2" src={assets.lcicon} alt="Dermatologist" />
                    <p>LeetCode</p>
                </Link>


            </div>
            <h1 className='my-4 text-4xl font-medium font-bold'>Start Today!!</h1>
            <button onClick={() => navigate('/login')}
                className='text-white text-bold text-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 rounded-lg'>
                Join Us</button>
        </div>
    )
}

export default Platforms