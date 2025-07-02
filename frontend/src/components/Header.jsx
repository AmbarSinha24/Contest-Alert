import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg px-6 md:px-10 lg:px-20 max-w-7xl mx-auto'>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Never Miss a <br />  Coding Contest
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    {/* <img className='w-8' src={assets.lcicon} alt="" /> */}
                    <p>Set Preferences or Simply browse through the list of upcoming Contests, <br className='hidden sm:block' /> add it in your Google Calender hassle-free.</p>
                </div>
                <a onClick={() => navigate('/contests')} className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                    View Contests
                    {/* <img className='w-3' src={assets.arrow_icon} alt="" /> */}
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative'>
                {/* <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.cficon} alt="" /> */}
            </div>
        </div>
    )
}

export default Header
