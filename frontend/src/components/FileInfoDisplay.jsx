import React from "react";

/**
 * 선택된 파일 정보 표시 
 * 
 * - fileInfo: { name: string, size: number }
 */

function FileInfoDisplay ({ fileInfo }) {
    if (!fileInfo) return null;

    return (
        <div className="mb-4">
            <p>파일 이름: {fileInfo.name}</p>
            <p>파일 용량: {(fileInfo.size / 1024).toFixed(2)} KB</p>
        </div>
    );
}

export default FileInfoDisplay;