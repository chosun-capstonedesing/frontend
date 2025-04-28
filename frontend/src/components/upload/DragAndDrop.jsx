import React, { useState } from "react";
import { isLoggedIn } from "../../utils/isLoggedIn";

/**
 * DragAndDrop 컴포넌트
 * - 드래그 앤 드롭 영역 전용 컴포넌트
 * - 파일 수 제한: 비로그인 사용자는 최대 10개 파일 업로드 가능
 * - onDrop: 파일이 드롭되었을 때 호출되는 핸들러
 * - onDragOver: 드래그 오버 시 호출되는 핸들러 -> 기본 동작 방지
 * - children: 내부에 표시할 컨텐츠 -> 파일 선택 버튼 등
 */

function DragAndDrop({ onDrop, onDragOver, children }) {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const maxCount = isLoggedIn() ? Infinity : 3;
        const totalCount = uploadedFiles.length + files.length;

        if (totalCount > maxCount) {
            alert(`비로그인 사용자는 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
            return;
        }

        setUploadedFiles(prev => [...prev, ...files]);

        if (onDrop) {
            onDrop(e);
        }
    };

    const maxDisplay = isLoggedIn() ? '무제한' : '10개';

    return (
        <div className="flex flex-col items-center space-y-2">
            <div
                onDrop={handleDrop}
                onDragOver={onDragOver}
                className="border-dashed border-2 border-gray-300 p-4 rounded mb-4 text-center w-full h-64 flex items-center justify-center text-gray-400"
            >
                {children}
            </div>
        </div>
    );
}

export default DragAndDrop;