import React from "react";

function TabNavigation ({ activeTab, setActiveTab }) {
    return (
        <div className="mb-4 border-b flex space-x-4">
            <button
                className={`py-2 px-4 ${activetab === 'analysis' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                onClick={() => setActiveTab('analysis')}
                >Analysis board</button>

            <button
                className={`py-2 px-4 ${activetab === 'performance' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                onClick={() => setActiveTab('performance')}
                >Model</button>

            <button
                className={`py-2 px-4 ${activetab === 'guide' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                onClick={() => setActiveTab('guide')}
                >Guide</button>
        </div>
    );
}

export default TabNavigation;