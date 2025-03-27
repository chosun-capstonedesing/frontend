import React from "react";
import { FaChartLine, FaDatabase, FaCogs, FaHome } from 'react-icons/fa';

function Sidebar ({ activeTab, setActiveTab }) {
    return (
        <aside className="w-64 bg-blue-600 text-white flex flex-col">
            {/** 로고 / 타이틀 영역 */}
            <div className="p-4 text-2xl font-bold border-b border-blue-400">
                CSEC
            </div>

            {/** 네비게이션 영역 */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={`flex itmes-center w-full p-2 rounded hover:bg-blue-500 transition-colors ${activeTab === 'analysis' ? 'bg-blue-700' : ''}`}
                        >
                        
                            <FaHome className="mr-2" />
                            분석
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveTab('dataset')}
                            className={`flex items-center w-full p-2 rounded hover:bg-blue-500 transition-colors ${activeTab === 'dataset' ? 'bg-blue-700' : ''}`}
                        >
                            <FaDatabase className="mr-2" />
                            데이터셋
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveTab('learning')}
                            className={`flex items-center w-full p-2 rounded hover:bg-blue-500 transition-colors ${activeTab === 'learning' ? 'bg-blue-700' : ''}`}
                        >
                            <FaChartLine className="mr-2"/>
                            학습 상태
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveTab('model')}
                            className={`flex items-center w-full p-2 rounded hover:bg-blue-500 transition-colors ${activeTab === 'model' ? 'bg-blue-700' : ''}`}
                        >
                            <FaCogs className="mr-2"/>
                            모델
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;