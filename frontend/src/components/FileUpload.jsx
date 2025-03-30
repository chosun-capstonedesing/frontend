import React, { useState, useRef } from "react";
import FileUploadView from "./FileUploadView";
import './FileUploadView.css';

/**
 * 파일 업로드 로직(컨테이너) 컴포넌트
 * -> 상태 및 이벤트 핸들러 담당
 * 
 * - onFileSelect : 파일 선택(또는 드롭) 시 상위에 파일 객체 전달
 * - onUploadProgress: 업로드 진행률(%) 표시
 */

function FileUpload({ onFileSelect, onUploadProgress }) {
    const [fileInfo, setFileInfo] = useState(null);
    const fileInputRef = useRef();

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFileInfo({ name: selectedFile.name, size: selectedFile.size });
            onFileSelect?.(selectedFile);
        }
    };

    // 드래그 앤 드롭 시 처리
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];

        if (droppedFile) {
            setFileInfo({ name: droppedFile.name, size: droppedFile.size });
            onFileSelect?.(droppedFile);
        }
    };

    // 드래그 오버 이벤트 처리 -> 기본 동작 방지
    const handleDragOver = (e) => e.preventDefault();

    // 분석 시작하기 버튼 -> 백엔드 API와 연결하여 분석 요청 처리
    const handleAnalyze = () => {
        if (!fileInfo) {
            alert("파일을 업로드해주세요.");
            return;
        }

        console.log("분석 시작: ", fileInfo);
    };

    return (
        <div>
            <FileUploadView
                fileInfo={fileInfo}
                fileinputRef={fileInputRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onFileChange={handleFileChange}
                uploadProgress={onUploadProgress}
            />

            <div className="mt-4 text-center">
                <button className="analyze-button" onClick={handleAnalyze}>분석하기</button>
            </div>
        </div>
    );
}

export default FileUpload;