import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Function to toggle the menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            {/* Top Alert */}
            <div className="flex h-[34px] bg-yellow-600 justify-center items-center text-center">
                <div className="flex">
                    <div className="-mr-8 mt-[2px]">
                        {/* Alert Icon */}
                        <svg
                            fill="#000000"
                            height="8px"
                            width="8px"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g>
                                <path d="M256,48C141.3,48,48,141.3,48,256s93.3,208,208,208,208-93.3,208-208S370.7,48,256,48Zm0,372a164,164,0,1,1,164-164A164,164,0,0,1,256,420ZM256,128a12,12,0,0,0-12,12V308a12,12,0,0,0,24,0V140A12,12,0,0,0,256,128Zm0,212a20,20,0,1,0,20,20A20,20,0,0,0,256,340Z" />
                            </g>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-[8px] font-semibold px-10">
                            BNB Beacon Chain has been shut down at block height 385,251,927 since December 3, 2024.
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div
                className={`flex px-[38px] h-11 justify-between bg-black text-white items-center transition-all duration-300 z-50 w-full ${isScrolled ? "fixed top-0 shadow-lg" : "relative"
                    }`}
            >
                {/* Logo */}
                <div>
                    <img src={logo} className="h-4 object-contain" alt="logo" />
                </div>

                {/* Links and Buttons */}
                <div className="hidden md:flex gap-8 items-center text-[12px]">
                    <div className="flex gap-8">
                        <h1 className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                            <a
                                href="https://www.bnbchain.org/en/bnb-smart-chain"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Chains
                            </a>
                        </h1>
                        <h1 className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                            <a href="https://portal.bnbchain.org/" target="_blank" rel="noopener noreferrer">
                                Developers
                            </a>
                        </h1>
                        <h1 className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                            <a href="https://www.bnbchain.org/en/wallets" target="_blank" rel="noopener noreferrer">
                                Ecosystem
                            </a>
                        </h1>
                        <h1 className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                            <a href="https://www.bnbchain.org/en/community" target="_blank" rel="noopener noreferrer">
                                Community
                            </a>
                        </h1>
                        <h1 className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                            <a
                                href="https://jobs.bnbchain.org/companies/bnb-chain#content"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Careers
                            </a>
                        </h1>
                    </div>
                    <div className="flex gap-2 text-[9px]">
                        <a href="https://www.bnbchain.org/en/contact" target="_blank" rel="noopener noreferrer">
                            <button className="border-[1px] px-[11px] py-[5px] hover:bg-white hover:text-black rounded-[4px] border-white">
                                Contact Us
                            </button>
                        </a>
                        <a href="https://portal.bnbchain.org/" target="_blank" rel="noopener noreferrer">
                            <button className="px-[11px] py-[5px] rounded-[4px] bg-white text-black">
                                Get Started
                            </button>
                        </a>
                    </div>
                </div>

                {/* Hamburger Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isMenuOpen ? (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
