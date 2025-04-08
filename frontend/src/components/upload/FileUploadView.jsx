import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import FileInfoDisplay from "./FileInfoDisplay";
import ProgressBar from "./ProgressBar";


/**
 * 파일 업로드 UI
 * - UI/마크업만 담당 -> 로직은 상위 FileUpload 에서 관리
 */

function FileUploadView ({
    fileInfo,
    fileinputRef,
    onDrop,
    onDragOver,
    onFileChange,
    uploadProgress,

}) {
    return (
        <div>
            {/* 드래그 앤 드롭 영역 */}
            <DragAndDrop onDrop={onDrop} onDragOver={onDragOver}>
                <FileInput
                    onFileChange={onFileChange}
                    inputRef={fileinputRef}
                    id="file-upload-input"
                />

                <label htmlFor="file-upload-input" className="cursor-pointer bg-transparent text-gray-800 hover:text-gray-500 font-semibold py-2 px-4 rounded">
                    📁 파일 선택하기 (또는 여기에 드래그 앤 드롭)
                </label>
            </DragAndDrop>

            {fileInfo && <FileInfoDisplay fileInfo={fileInfo} />}
            
            {typeof uploadProgress === "number" && (
                <ProgressBar progress={uploadProgress} />
            )}
        </div>
    );
}

export default FileUploadView;