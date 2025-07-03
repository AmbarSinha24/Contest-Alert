import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className='mt-[100px]'>
            {/* Horizontal line above footer */}
            <hr className="border-t border-gray-800 dark:border-gray-700 max-w-7xl mb-5 mx-auto" />
            <footer className="bg-white dark:bg-gray-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a onClick={() => navigate('/')} className="flex items-center cursor-pointer">
                                <img src={assets.logo} class="h-8 me-3" alt="FlowBite Logo" />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Contest Alert</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                                    <li>
                                        <a href="https://react.dev/" className="hover:underline">React</a>
                                    </li>
                                    <li>
                                        <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                                    </li>
                                    <li>
                                        <a href="https://nodejs.org/en" className="hover:underline">Node JS</a>
                                    </li>
                                    <li>
                                        <a href="https://www.mysql.com/" className="hover:underline">MySQL</a>
                                    </li>
                                    <li>
                                        <a href="https://console.cloud.google.com/welcome?inv=1&invt=Ab1tEA&project=amiable-catfish-430020-d4" className="hover:underline">Google Cloud Console</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://github.com/AmbarSinha24" className="hover:underline ">Github</a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/in/ambar-sinha-b90249206/" className="hover:underline">LinkedIn</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline">Privacy Policy</a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a onClick={() => navigate('/')} className="hover:underline">Contest Alert</a>
                        </span>
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400"> Created by Ambar Sinha</span>
                        <div className="flex mt-4 sm:justify-center sm:mt-0">



                            <a href="https://github.com/AmbarSinha24" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
                                </svg>
                                <span className="sr-only">GitHub account</span>
                            </a>
                            <a href="https://www.linkedin.com/in/ambar-sinha-b90249206/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554V14.81c0-1.345-.028-3.073-1.875-3.073-1.877 0-2.164 1.464-2.164 2.975v5.74h-3.554V9h3.414v1.561h.048c.476-.9 1.636-1.848 3.366-1.848 3.6 0 4.266 2.37 4.266 5.455v6.284zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.107 20.452H3.563V9h3.544v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.543C0 23.227.792 24 1.771 24h20.451C23.207 24 24 23.227 24 22.271V1.728C24 .774 23.207 0 22.225 0z" />
                                </svg>
                                <span className="sr-only">LinkedIn account</span>
                            </a>

                        </div>
                    </div>
                </div>
            </footer>
        </div>

    )
}

export default Footer