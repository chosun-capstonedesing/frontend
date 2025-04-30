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
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files) => {
        const maxCount = isLoggedIn() ? Infinity : 3;
        const totalCount = uploadedFiles.length + files.length;

        if (totalCount > maxCount) {
            alert(`비로그인 사용자는 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
            return false;
        }

        setUploadedFiles(prev => [...prev, ...files]);
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);

        if (handleFiles(files) && onDrop) {
            onDrop(e);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
        if (onDragOver) onDragOver(e);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const maxDisplay = isLoggedIn() ? '무제한' : '3개';

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`group border-dashed border-2 mb-4 p-4 rounded-2xl text-center w-full h-40 flex items-center justify-center transition-colors duration-200 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
        >
            {children}
            <label
              htmlFor="file-upload-input"
              className="cursor-pointer bg-transparent text-gray-800 group-hover:text-blue-600 hover:text-gray-500 font-semibold py-2 px-4 rounded flex flex-col items-center space-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              파일 선택하기<br />(또는 여기에 드래그 앤 드롭)
            </label>
        </div>
    );
}

export default DragAndDrop;