import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { UserContext } from "./../../context/UserContext";

export default function Navbar() {
    const { userToken, setuserToken, user, setuser } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu automatically on route change
    React.useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    function handleLogout() {
        setuserToken(null);
        setuser(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setMenuOpen(false);
    }

    return (
        <nav className="bg-white fixed w-full z-30 top-0 left-0 right-0 shadow-md">
            <div className="flex items-center justify-between mx-auto px-4 py-3 max-w-7xl">
                {/* Logo */}
                <Link to="" className="flex items-center space-x-2">
                    <img
                        src="/assets/photo_2026-01-26_21-40-13.jpg"
                        className="h-9 md:h-11 rounded-lg"
                        alt="Logo"
                    />
                    <span className="text-xl font-1 text-[#00B3A1]">ThyroCare</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to=""
                        end
                        className={({ isActive }) =>
                            `font-1 text-lg pb-1 ${isActive
                                ? "border-b-2 border-[#00B3A1] text-[#444]"
                                : "text-[#444] hover:text-[#00B3A1]"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    {userToken && user && (
                        <>
                            <NavLink
                                to="dashboard"
                                className={({ isActive }) =>
                                    `font-1 text-lg pb-1 ${isActive
                                        ? "border-b-2 border-[#00B3A1] text-[#444]"
                                        : "text-[#444] hover:text-[#00B3A1]"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="report"
                                className={({ isActive }) =>
                                    `font-1 text-lg pb-1 ${isActive
                                        ? "border-b-2 border-[#00B3A1] text-[#444]"
                                        : "text-[#444] hover:text-[#00B3A1]"
                                    }`
                                }
                            >
                                Report
                            </NavLink>
                        </>
                    )}

                    <NavLink
                        to="about"
                        className={({ isActive }) =>
                            `font-1 text-lg pb-1 ${isActive
                                ? "border-b-2 border-[#00B3A1] text-[#444]"
                                : "text-[#444] hover:text-[#00B3A1]"
                            }`
                        }
                    >
                        About Us
                    </NavLink>
                </div>

                {/* Desktop auth buttons */}
                <div className="hidden md:flex items-center space-x-3">
                    {!userToken || !user ? (
                        <>
                            <Link
                                to="login"
                                className="text-white text-sm px-6 py-2 bg-[#00B3A1] rounded-full font-1 hover:bg-[#009e8e] transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="signup"
                                className="text-white text-sm px-6 py-2 bg-[#282828] rounded-full font-1 hover:bg-[#3a3a3a] transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="profile">
                                {user.gender === "female" ? (
                                    <img
                                        src="/assets/girl.png"
                                        className="w-10 h-10 rounded-full border-2 border-[#00B3A1]/30 hover:border-[#00B3A1] transition-colors"
                                        alt="Profile"
                                    />
                                ) : (
                                    <img
                                        src="/assets/boy.png"
                                        className="w-10 h-10 rounded-full border-2 border-[#00B3A1]/30 hover:border-[#00B3A1] transition-colors"
                                        alt="Profile"
                                    />
                                )}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm px-4 py-2 border border-[#00B3A1] text-[#00B3A1] rounded-full font-1 hover:bg-[#00B3A1] hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Hamburger button — mobile only */}
                <button
                    type="button"
                    className="md:hidden p-2 text-[#00B3A1]"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-2xl`}></i>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="px-4 py-3 space-y-1">
                        <NavLink
                            to=""
                            end
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block py-2 px-3 rounded-lg font-1 text-lg ${isActive
                                    ? "bg-[#00B3A1]/10 text-[#00B3A1]"
                                    : "text-[#444] hover:bg-gray-50"
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        {userToken && user && (
                            <>
                                <NavLink
                                    to="dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 px-3 rounded-lg font-1 text-lg ${isActive
                                            ? "bg-[#00B3A1]/10 text-[#00B3A1]"
                                            : "text-[#444] hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="report"
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 px-3 rounded-lg font-1 text-lg ${isActive
                                            ? "bg-[#00B3A1]/10 text-[#00B3A1]"
                                            : "text-[#444] hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    Report
                                </NavLink>
                            </>
                        )}

                        <NavLink
                            to="about"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block py-2 px-3 rounded-lg font-1 text-lg ${isActive
                                    ? "bg-[#00B3A1]/10 text-[#00B3A1]"
                                    : "text-[#444] hover:bg-gray-50"
                                }`
                            }
                        >
                            About Us
                        </NavLink>
                    </div>

                    {/* Mobile auth buttons */}
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        {!userToken || !user ? (
                            <div className="flex gap-3">
                                <Link
                                    to="login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex-1 text-center text-white py-2 bg-[#00B3A1] rounded-full font-1 hover:bg-[#009e8e] transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="signup"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex-1 text-center text-white py-2 bg-[#282828] rounded-full font-1 hover:bg-[#3a3a3a] transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <Link
                                    to="profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center space-x-2"
                                >
                                    {user.gender === "female" ? (
                                        <img src="/assets/girl.png" className="w-9 h-9 rounded-full" alt="Profile" />
                                    ) : (
                                        <img src="/assets/boy.png" className="w-9 h-9 rounded-full" alt="Profile" />
                                    )}
                                    <span className="font-1 text-[#444]">Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm px-4 py-2 border border-[#00B3A1] text-[#00B3A1] rounded-full font-1 hover:bg-[#00B3A1] hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}