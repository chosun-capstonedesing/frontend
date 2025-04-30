import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";


/**
 * 파일 업로드 UI
 * - UI/마크업만 담당 -> 로직은 상위 FileUpload 에서 관리
 */

function FileUploadView({
  fileList,
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
      </DragAndDrop>

      {typeof uploadProgress === "number" && (
        <ProgressBar progress={uploadProgress} />
      )}
    </div>
  );
}

export default FileUploadView;