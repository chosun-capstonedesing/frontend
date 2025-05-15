import React, { useState, useRef, useEffect } from "react";
import FileUploadView, { FileUploadPreviewList } from "./FileUploadView";
import { useToast } from "../../context/ToastContext";
import { useUploadLimit } from "./useUploadLimit";
import { useUploadSession } from "./useUploadSession";
import { handleAnalyzeFile } from "./handleAnalyzeFile";

function FileUpload({ onFileSelect, onUploadProgress }) {
  const fileInputRef = useRef();
  const { showToast, updateProgress, updateToastStatus } = useToast();
  const { maxCount, remainingInfo, isActuallyLoggedIn } = useUploadLimit();
  const [fileList, setFileList, updateSession] = useUploadSession(isActuallyLoggedIn, maxCount);
  const [progressMap, setProgressMap] = useState({});

  const isLoggedIn = import.meta.env.DEV ? true : isActuallyLoggedIn();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!isLoggedIn && fileList.length + selectedFiles.length > maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }
    updateSession(selectedFiles);
    onFileSelect?.(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!isLoggedIn && fileList.length + droppedFiles.length > maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }
    updateSession(droppedFiles);
    onFileSelect?.(droppedFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleAnalyzeFileClick = (index) => {
    handleAnalyzeFile(
      index,
      fileList,
      setFileList,
      setProgressMap,
      showToast,
      updateProgress,
      updateToastStatus,
      onFileSelect
    );
  };

  useEffect(() => {
    fileList.forEach((file, index) => {
      if (file.status === "done") {
        updateToastStatus(index);
      }
    });
  }, [fileList, updateToastStatus]);

  return (
    <div>
      <FileUploadView
        fileList={fileList}
        fileinputRef={fileInputRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onFileChange={handleFileChange}
        uploadProgress={onUploadProgress}
        multiple
      />

      <FileUploadPreviewList
        fileList={fileList}
        setFileList={setFileList}
        isLoggedIn={isLoggedIn}
        remainingInfo={remainingInfo}
        progressMap={progressMap}
        onAnalyzeFile={handleAnalyzeFileClick}
      />

      <div className="mt-3 text-sm text-center text-gray-500">
        업로드 파일 수:{" "}
        {isLoggedIn
          ? `${fileList.length} / 제한 없음`
          : `${fileList.length} / ${remainingInfo?.limit ?? 3}`}
      </div>
    </div>
  );
}

export default FileUpload;