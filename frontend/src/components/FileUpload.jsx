// 파일 업로드, 드래그 앤 드롭, 파일 정보 및 진행률 표시 기능
import React, { useState, useRef } from "react";

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
}