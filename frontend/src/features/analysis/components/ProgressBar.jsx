import React from "react";

/**
 * 업로드 진행률 표시 -> 프로그레스 바 컴포넌트
 * progress: number (0 ~ 100)
 */

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