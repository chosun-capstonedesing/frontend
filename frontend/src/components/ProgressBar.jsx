import React from "react";

function ProgressBar({ progress }) {
    if(typeof progress !== 'number') return null;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
                className="bg-blue-600 h-.25 rounded-full ransition-all"
                style={{ width: '${progress}%' }}
            />
        </div>
    );
}

export default ProgressBar;