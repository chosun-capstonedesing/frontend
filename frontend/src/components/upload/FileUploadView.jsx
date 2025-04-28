import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import FileInfoDisplay from "./FileInfoDisplay";
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

        <label
          htmlFor="file-upload-input"
          className="cursor-pointer bg-transparent text-gray-800 hover:text-gray-500 font-semibold py-2 px-4 rounded"
        >
          📁 파일 선택하기 (또는 여기에 드래그 앤 드롭)
        </label>
      </DragAndDrop>

      {/* ✅ 파일 리스트 표시 */}
      {fileList && fileList.length > 0 ? (
        <div className="space-y-2">
          {fileList.slice(-3).map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-gray-800">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center mt-4">업로드된 파일이 없습니다.</p>
      )}

      {typeof uploadProgress === "number" && (
        <ProgressBar progress={uploadProgress} />
      )}
    </div>
  );
}

export default FileUploadView;