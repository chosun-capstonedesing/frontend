import React from "react";
import Sidebar from './Sidebar';

function Layout ({ childern, activeTab, setActiveTab }) {
    return (
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
                {childern}
            </main>
        </div>
    );
}

export default Layout;