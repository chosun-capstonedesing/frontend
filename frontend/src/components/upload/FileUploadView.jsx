import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";


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
          multiple
        />
      </DragAndDrop>

      {typeof uploadProgress === "number" && (
        <ProgressBar progress={uploadProgress} />
      )}
    </div>
  );
}

export default FileUploadView;

export function FileUploadPreviewList({
  fileList,
  setFileList,
  isLoggedIn,
  remainingInfo,
  progressMap,
  onAnalyzeFile,
}) {
  return (
    <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {fileList
        .map((file, i) => ({ file, originalIndex: i }))
        .slice(-3)
        .reverse()
        .map(({ file, originalIndex }) => (
          <li
            key={originalIndex}
            className="relative group p-3 flex flex-col space-y-2"
          >
            <button
              onClick={() => {
                const updated = [...fileList];
                updated.splice(originalIndex, 1);
                setFileList(updated);
                sessionStorage.setItem("uploadedFiles", JSON.stringify(updated));
                sessionStorage.setItem("uploadedCount", String(updated.length));
                localStorage.setItem("uploadedFiles", JSON.stringify(updated));
                window.dispatchEvent(new Event("fileListUpdated"));
              }}
              className="absolute -top-2 -left-2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="파일 삭제"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {file.status === "done" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="none"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-black">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.uploadedAt || new Date().toLocaleDateString()} ·{" "}
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                className={`ml-4 text-sm font-medium px-3 py-1 rounded 
                  ${
                    file.status === "done"
                      ? "bg-green-100 text-green-700"
                      : file.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                disabled={file.status === "done"}
                onClick={() => onAnalyzeFile(originalIndex)}
              >
                {file.status === "done"
                  ? "분석 완료"
                  : file.status === "processing"
                  ? "분석 중"
                  : "분석하기"}
              </button>
            </div>
            {file.status === "processing" && (
              <div className="w-full mt-2">
                <div className="text-xs text-yellow-600 mb-1">분석 중...</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 bg-yellow-400 rounded-full transition-all duration-200"
                      style={{
                        width: `${progressMap[originalIndex] || 0}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {progressMap[originalIndex] || 0}%
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
    </ul>
  );
}