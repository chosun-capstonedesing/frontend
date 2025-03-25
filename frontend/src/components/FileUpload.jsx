import React, { useState, useRef } from "react";
import FileInput from "./FileInput";
import DragAndDrop from "./DragAndDrop";
import FileUploadView from "./FileUploadView";

function FileUpload ({ onFileSelect, onUploadProgress }) {
    const [fileInfo, setFileInfo] = useState(null);
    const fileInputRef = useRef();

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            setFileInfo ({
                name: selectedFile.name,
                size: selectedFile.size,
            });
            
            onFileSelect (selectedFile);
        }
    };

    // 드래그 앤 드롭 시 처리
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];

        if (droppedFile) {
            setFileInfo ({
                name: droppedFile.name,
                size: droppedFile.size,
            });

            onFileSelect(droppedFile);
        }
    };

    // 드래그 오버 이벤트 처리 -> 기본 동작 방지
    const handleDropOver = (e) => {
        e.preventDefault();
    };

    return (
        <FileUploadView
            fileinfo={fileInfo}
            fileinputRef={fileInputRef}
            onDrop={handleDrop}
            onDragOver={handleDropOver}
            onFileChange={handleFileChange}
        />
    );
}

export default FileUpload;