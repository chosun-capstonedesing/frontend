import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import fileInfoDisplay from "./FileInfoDispaly";

function FileUploadView ({
    fileinfo,
    fileinputRef,
    onDrop,
    onDragOver,
    onFileChange,
}) {
    return (
        <div>
            {/* 드래그 앤 드롭 영역 */}
            <DragAndDrop onDrop={onDrop} onDragOver={onDragOver}></DragAndDrop>
            <FileInput
                onFileChange={onFileChange}
                inputRef={fileinputRef}
                id="file-upload-input"
            />
        </div>
    )
}

export default FileUploadView;