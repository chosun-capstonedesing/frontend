import React, { useState } from "react";
import Sidebar from './Sidebar';

/**
 * 사이드바와 메인 콘텐츠 영역을 나누는 레이아웃
 * 
 * - children: 메인 영역에 표시할 컴포넌트
 * - activeTab: 현재 활성화 된 탭 (Sidebar에 전달)
 * - setActiveTab: 탭 전환 함수 (Sidebar에 전달)
 */

function Layout({ children, activeTab, setActiveTab }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);


    return (
        <div className="flex h-60">
            {/* Sidebar */}
            <div className={`${
                sidebarOpen ? "block" : "hidden"
            } md:block fixed top-20 left-0 z-40 w-64 h-[85vh] max-h-screen bg-blue-600 text-white md:static md:flex-shrink-0`}>
                {/* 닫기 버튼 (모바일용) */}
                <div className="md:hidden p-4 flex justify-end">
                    <button onClick={toggleSidebar} className="text-white text-2xl">
                        ✕
                    </button>
                </div>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* 햄버거 메뉴 버튼 (모바일에서만 표시) */}
            {!sidebarOpen && (
                <button
                    className="absolute top-4 left-7 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md md:hidden"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
            )}

            {/* Main Content */}
            <main className={`flex-1 bg-gray-100 mt-4 mb-4 mx-4 h-[80vh]
            overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-4" : "ml-4"}`}>
                {children}
            </main>
        </div>
    );
}

export default Layout;