import React, { useState } from 'react';
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

    const handleToggle = () => setIsExpanded(!isExpanded);

    return (
        <div>
            <div className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
                <div className="flex items-center h-16 px-4 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-lg" />
                    <h1 className={`ml-2 mt-1 text-lg font-semibold text-black overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                        SideBar
                    </h1>
                </div>

                <nav className="p-4 space-y-3 px-2">
                    <SidebarItem icon={<FaHome />} label="분석" path="/" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                    <SidebarItem icon={<FaDatabase />} label="데이터셋" path="/dataset" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                    <SidebarItem icon={<FaChartLine />} label="학습 상태" path="/learning" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                    <SidebarItem icon={<FaCogs />} label="모델" path="/model" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                    <SidebarItem icon={<FaTachometerAlt />} label="성능" path="/performance" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                    <SidebarItem icon={<FaInfoCircle />} label="정보" path="/guide" currentTab={currentTab} navigate={navigate} isExpanded={isExpanded} />
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <img src="/CSEC.PNG" alt="Profile" className="w-8 h-8 rounded-full" />
                        {isExpanded && (
                            <div className={`ml-3 overflow-hidden`}>
                                <p className="text-sm font-medium text-black truncate">CSEC</p>
                                <p className="text-xs text-gray-500 break-words leading-snug">Chosun University <br /> Information Security Project</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={handleToggle} className="fixed left-4 top-4 z-50 w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-400 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
    );
};

const SidebarItem = ({ icon, label, path, currentTab, navigate, isExpanded }) => (
    <button
        onClick={() => navigate(path)}
        className={`flex items-center w-full h-10 px-3 rounded-lg hover:bg-blue-100 transition-colors ${currentTab === path ? 'bg-blue-200' : ''}`}
    >
        <span className="w-5 h-5 text-xl text-blue-600">{icon}</span>
        <span className={`ml-3 mt-1 text-black whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
);

export default Sidebar;