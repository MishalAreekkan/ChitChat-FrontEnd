import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../slice/authSlice';
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

function UserNavbar() {
    const dispatch = useDispatch();
    const nav = useNavigate();

    const logout = () => {
        dispatch(removeAuthToken());
        nav('/login');
    };
    
    return (
        <header className="w-full flex items-center justify-between px-6 py-4 border-b-2 bg-white text-black">
            <div className="font-bold text-lg">CHIT CHAT</div>
            <nav className="hidden md:flex space-x-6 text-lg font-medium">
                <a href="/userhome" className="hover:text-gray-400 transition-colors">Home</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Video</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Community</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Messaging</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Jobs</a>
            </nav>
            <div className="flex items-center space-x-4 ">
                <button className="text-black placeholder:'Search' hover:text-gray-400 transition-colors">
                <CiSearch />
                </button>
                <button className="text-black hover:text-gray-400 transition-colors">
                <FaBell />
                </button>
                <button onClick={()=>nav("/useredit")} className="text-black hover:text-gray-400 transition-colors">
                <FaUserAlt />
                </button>
            </div>
            <button
                className="text-black px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white text-lg transition-colors"
                onClick={logout}>
                Sign out
            </button>
            <div className="md:hidden">
                <button className="text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </header>
    );
}

export default UserNavbar;
