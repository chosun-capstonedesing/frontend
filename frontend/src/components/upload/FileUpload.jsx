import React, { useState, useRef, useEffect } from "react";
import FileUploadView from "./FileUploadView";
import { isLoggedIn } from "../../utils/isLoggedIn";

/**
 * 파일 업로드 로직(컨테이너) 컴포넌트
 * -> 상태 및 이벤트 핸들러 담당
 * 
 * - onFileSelect : 파일 선택(또는 드롭) 시 상위에 파일 객체 전달
 * - onUploadProgress: 업로드 진행률(%) 표시
 */

function FileUpload({ onFileSelect, onUploadProgress }) {
    const [fileList, setFileList] = useState([]);
    const fileInputRef = useRef();

    const isActuallyLoggedIn = () => {
        if (import.meta.env.DEV) {
            return true; // 개발 중에는 항상 로그인된 상태로
        }
        return isLoggedIn();
    };

    const maxCount = isActuallyLoggedIn() ? Infinity : 3;

    // ✅ 새로고침에도 비로그인 업로드 제한 수 유지
    useEffect(() => {
        const savedFiles = JSON.parse(sessionStorage.getItem('uploadedFiles') || '[]');
        setFileList(savedFiles.slice(0, maxCount)); // 새로고침했을 때 파일 리스트 복원
    }, []);

    // ✅ 로그인한 경우 업로드 제한/이전 파일 초기화
    useEffect(() => {
        if (isActuallyLoggedIn()) {
            sessionStorage.removeItem('uploadedFiles');
            sessionStorage.removeItem('uploadedCount');
        }
    }, []);

    const updateSession = (newFiles) => {
        const updatedFiles = [...fileList, ...newFiles].slice(0, maxCount);
        sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
        sessionStorage.setItem('uploadedCount', String(updatedFiles.length));
        setFileList(updatedFiles);
    };

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (fileList.length + selectedFiles.length > maxCount) {
            alert(`비로그인 사용자는 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
            return;
        }

        updateSession(selectedFiles);
        onFileSelect?.(selectedFiles);
    };

    // 드래그 앤 드롭 시 처리
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);

        if (fileList.length + droppedFiles.length > maxCount) {
            alert(`비로그인 사용자는 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
            return;
        }

        updateSession(droppedFiles);
        onFileSelect?.(droppedFiles);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleAnalyze = () => {
        if (fileList.length === 0) {
            alert("파일을 업로드해주세요.");
            return;
        }

        console.log("분석 시작: ", fileList.map(f => f.name));
    };

    return (
        <div>
            <FileUploadView
                fileList={fileList}
                fileinputRef={fileInputRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onFileChange={handleFileChange}
                uploadProgress={onUploadProgress}
            />
            {/* ✅ 업로드한 파일 수 표시 */}
            <div className="mt-2 text-sm text-center text-gray-600">
                업로드한 파일: {fileList.length}개 / {isActuallyLoggedIn() ? '무제한' : '3개'}
            </div>

            <div className="mt-4 text-center">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleAnalyze}>
                    분석하기
                </button>
            </div>
        </div>
    );
}

export default FileUpload;