import React, { Children } from "react";
import Sidebar from './Sidebar';

/**
 * 사이드바와 메인 콘텐츠 영역을 나누는 레이아웃
 * 
 * - children: 메인 영역에 표시할 컴포넌트
 * - activeTab: 현재 활성화 된 탭 (Sidebar에 전달)
 * - setActiveTab: 탭 전환 함수 (Sidebar에 전달)
 */

function Layout ({ children, activeTab, setActiveTab }) {
    return (
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default Layout;