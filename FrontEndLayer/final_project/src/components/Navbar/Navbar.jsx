import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from './../../context/UserContext';

export default function Navbar() {

    let { userToken, setuserToken, user, setuser } = useContext(UserContext)

    return <>

        <nav className=" bg-white fixed w-full z-30 top-0 left-0 right-0 shadow-md">
            <div className="flex flex-wrap items-center justify-between mx-auto p-3">

                <Link to="" className="flex items-center space-x-3">
                    <img src="/assets/photo_2026-01-26_21-40-13.jpg" className="h-9 md:h-11 rounded-lg" alt="Logo" />
                    <span className="self-center text-xl font-1 color-1">ThyroCare</span>
                </Link>

                <div className="flex items-center md:order-2 space-x-3">
                    {!(userToken && user) ?
                        <div className="hidden md:flex space-x-3">
                            <Link to="login" className="text-white text-lg  px-7 py-1 background-1 rounded-full">Log in</Link>
                            <Link to="signup" className="text-white text-lg px-7 py-1 background-2 rounded-full">Sign up</Link>
                        </div> :
                        <div>
                            {user.gender === "female" ?
                                <Link to="profile"><img src="/assets/girl.png" className="w-10 rounded-full" /></Link> :
                                <Link to="profile"><img src="/assets/boy.png" className="w-10 rounded-full" /></Link>
                            }
                        </div>
                    }
                    <button type="button" data-collapse-toggle="navbar-sticky" className=" inline-flex items-center p-2 w-10 h-10 justify-center md:hidden" aria-controls="navbar-sticky" aria-expanded="false">
                        <i className="fa-solid fa-bars color-1 text-2xl"></i>
                    </button>
                </div>

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 border border-default border-[#00B3A1] rounded-base space-x-6 lg:space-x-8 md:flex-row md:mt-0 md:border-0 ">

                        <li>
                            <NavLink to="" end className={({ isActive }) => `block py-2 px-3 md:p-0 md:pb-2 font-1 text-lg 
                        ${isActive ? "border-b-2 border-[#00B3A1] color-2" : "color-2"}`}> Home </NavLink>
                        </li>
                        {userToken && user ?
                            <>
                                <li>
                                    <NavLink to="dashboard" className={({ isActive }) => `block py-2 px-3 md:p-0 md:pb-2 font-1 text-lg 
                                ${isActive ? "border-b-2 border-[#00B3A1] color-2" : "color-2"}`}> Dashboard </NavLink>
                                </li>
                                <li>
                                    <NavLink to="report" className={({ isActive }) => `block py-2 px-3 md:p-0 md:pb-2 font-1 text-lg 
                                ${isActive ? "border-b-2 border-[#00B3A1] color-2" : "color-2"}`}> Report </NavLink>
                                </li>
                            </> : null
                        }
                        <li>
                            <NavLink to="about" className={({ isActive }) => `block py-2 px-3 md:p-0 md:pb-2 font-1 text-lg 
                        ${isActive ? "border-b-2 border-[#00B3A1] color-2" : "color-2"}`}> About Us </NavLink>
                        </li>
                        {!(userToken && user) ?
                            <li className="flex flex-col gap-3 mt-4 md:hidden">
                                <Link to="/login" className="text-center text-white px-4 py-2 background-1 rounded-full">Log in</Link>
                                <Link to="/signup" className="text-center text-white px-4 py-2 background-2 rounded-full">Sign up</Link>
                            </li> : null
                        }
                    </ul>
                </div>

            </div>
        </nav>

    </>
}