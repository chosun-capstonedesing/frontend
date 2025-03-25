import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import fileInfoDisplay from "./FileInfoDispaly";
import ProgressBar from "./ProgressBar";

function FileUploadView ({
    fileInfo,
    fileinputRef,
    onDrop,
    onDragOver,
    onFileChange,
    onUploadProgress,

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

                <label htmlFor="file-upload-input" className="cursor-pointer">
                    파일 업로드 (또는 여기에 드래그 앤 드롭)
                </label>
            </DragAndDrop>

            <fileInfoDisplay fileInfo={fileInfo} />
            <ProgressBar progress={onUploadProgress} />
        </div>
    );
}

export default FileUploadView;