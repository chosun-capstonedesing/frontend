import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaChartLine,
    FaDatabase,
    FaCogs,
    FaTachometerAlt,
    FaInfoCircle,
} from 'react-icons/fa';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname;
    const sidebarRef = useRef(null);
    const toggleButtonRef = useRef(null);

    const handleToggle = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        setIsExpanded(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isExpanded &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded]);

    return (
        <div className="relative z-50 overflow-x-hidden">
            <div ref={sidebarRef} className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col overflow-x-hidden ${isExpanded ? 'w-64' : 'w-20'}`}>
                <div className="flex items-center h-16 px-6 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-lg" />
                    <h1 className={`ml-4 mt-1 text-lg font-semibold text-black overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Sidebar</h1>
                </div>

                <nav className="p-4 space-y-4 px-4 flex-1 overflow-y-auto overflow-x-hidden">
                    <SidebarItem icon={<FaHome />} label="분석" path="/" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    <SidebarItem icon={<FaDatabase />} label="데이터셋" path="/dataset" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    <SidebarItem icon={<FaChartLine />} label="학습 상태" path="/learning" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    <SidebarItem icon={<FaCogs />} label="모델" path="/model" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    <SidebarItem icon={<FaTachometerAlt />} label="성능" path="/performance" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                    <SidebarItem icon={<FaInfoCircle />} label="정보" path="/guide" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                </nav>

                <a href='https://github.com/chosun-capstonedesing' target='_blank' rel='noopener noreferrer'>
                    <div className="ml-1 p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center">
                            <img src="/CSEC.PNG" alt="Profile" className="w-9 h-9 rounded-full" />
                            {isExpanded && (
                                <div className={`ml-4 overflow-hidden`}>
                                    <p className="text-sm font-medium text-black truncate">CSEC</p>
                                    <p className="text-xs text-gray-500 break-words leading-snug">Chosun University <br /> Information Security Major <br /> Industry-Academic Project</p>
                                </div>
                            )}
                        </div>
                    </div>
                </a>
            </div>

            <button ref={toggleButtonRef} onClick={handleToggle} className="fixed left-6 top-4 z-50 w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-400 focus:outline-none">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
    );
};

const SidebarItem = ({ icon, label, path, currentTab, navigate, isExpanded, setIsExpanded }) => (
    <button
        onClick={() => {
            navigate(path);
            setIsExpanded(false);
        }}
        className={`flex items-center w-full h-12 px-3 rounded-lg hover:bg-blue-100 transition-colors ${currentTab === path ? 'bg-blue-200' : ''}`}
    >
        <span className="w-5 h-5 text-2xl text-blue-600">{icon}</span>
        <span className={`ml-5 mt-2 text-black whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
);

export default Sidebar;