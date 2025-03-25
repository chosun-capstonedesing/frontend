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
                        /** */
                    </li>
                </ul>
            </nav>
        </aside>
    )
}