import React from "react";
import Sidebar from './Sidebar';

/**
 * 사이드바와 메인 콘텐츠 영역을 나누는 레이아웃
 * 
 * - children: 메인 영역에 표시할 컴포넌트
 */

function Layout({ children }) {
    return (
        <div className="flex w-full">
            <div className="w-16">
                <Sidebar />
            </div>

            <main className="flex-1 bg-gray-100 overflow-y-auto overflow-x-hidden
            transition-all duration-300 px-4 py-4">
                {children}
            </main>
        </div>
    );
}

export default Layout;