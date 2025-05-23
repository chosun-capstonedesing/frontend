import React, { useState, useRef, useEffect } from "react";
import FileUploadView, { FileUploadPreviewList } from "./FileUploadView";
import { useToast } from "../../../context/ToastContext";
import { useUploadLimit } from "../components/useUploadLimit";
import { useUploadSession } from "../components/useUploadSession";
import { handleAnalyzeFile } from "./handleAnalyzeFile";

// ✅ 파일 업로드 및 분석을 담당하는 최상위 컴포넌트
function FileUpload({ onFileSelect, onUploadProgress }) {
  // 파일 input 요소에 접근하기 위한 ref (드래그앤드롭/파일선택 트리거용)
  const fileInputRef = useRef();

  // 토스트 알림 관련 함수 및 상태 제공 (알림 표시, 진행률 갱신 등)
  const { showToast, updateProgress, updateToastStatus } = useToast();

  // 업로드 제한(최대 개수), 남은 업로드 정보, 로그인 여부 제공
  const { maxCount, remainingInfo, isActuallyLoggedIn } = useUploadLimit();

  // 업로드된 파일 리스트 및 세션 관리 (로그인 여부 및 제한 적용)
  const [fileList, setFileList, updateSession] = useUploadSession(isActuallyLoggedIn, maxCount);

  // 각 파일별 업로드/분석 진행률 저장 객체
  const [progressMap, setProgressMap] = useState({});

  // 로그인 여부 확인(개발 환경에선 항상 true)
  const isLoggedIn = import.meta.env.DEV ? true : isActuallyLoggedIn();

  const isExceedingLimit = (newFilesCount) => {
    return !isLoggedIn && fileList.length + newFilesCount > maxCount;
  };

  const handleFileDelete = (targetFile) => {
    const updatedFiles = fileList.filter(
      (f) => f.id !== targetFile.id && f.name !== targetFile.name
    );
    setFileList(updatedFiles);
    updateSession(updatedFiles);
  };


  // ---------------------------
  // 파일 선택(input) 시 처리 함수
  // - 업로드 제한 초과 시 경고
  // - 선택 파일 세션에 추가 및 콜백 호출
  // ---------------------------
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.filter(
      file => !fileList.some(f =>
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified
      )
    );
    if (newFiles.length === 0) {
      alert("이미 분석한 파일입니다. 히스토리를 확인해주세요");
      return;
    }

    if (isExceedingLimit(newFiles.length)) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }
    updateSession(newFiles);
    onFileSelect?.(newFiles);
  };

  // ---------------------------
  // 파일 드롭(Drag & Drop) 시 처리 함수
  // - 업로드 제한 초과 시 경고
  // - 드롭 파일 세션에 추가 및 콜백 호출
  // ---------------------------
  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.filter(
      file => !fileList.some(f =>
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified
      )
    );
    if (newFiles.length === 0) {
      alert("이미 분석한 파일입니다. 히스토리를 확인해주세요");
      return;
    }

    if (isExceedingLimit(newFiles.length)) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }
    updateSession(newFiles);
    onFileSelect?.(newFiles);
  };

  // ---------------------------
  // 드래그 오버 시 기본 동작 방지 (드롭 가능하게)
  // ---------------------------
  const handleDragOver = (e) => e.preventDefault();

  // ---------------------------
  // 파일 분석 버튼 클릭 시 분석 실행 트리거
  // - handleAnalyzeFile 유틸 호출
  // - 진행률, 토스트, 결과 등 상태 갱신
  // ---------------------------
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

  // ---------------------------
  // 분석 완료된 파일의 토스트 상태 갱신 (향상된 신뢰성)
  // - fileList의 각 파일 상태를 확인하고, 결과/로그 등 실제 데이터가 존재할 때만 토스트 및 세션 업데이트
  // ---------------------------
  useEffect(() => {
    let changed = false;

    const updatedList = fileList.map((file, index) => {
      if (
        file.status === "done" &&
        !file.toastUpdated &&
        file.name &&
        file.size > 0 &&
        (file.result || file.malicious !== undefined || file.log)
      ) {
        const updatedFile = { ...file, toastUpdated: true };
        updateToastStatus(index);
        updateSession(fileList.map((f, i) => (i === index ? updatedFile : f)));
        changed = true;
        return updatedFile;
      }
      return file;
    });

    if (changed) {
      setFileList(updatedList);
    }
  }, [fileList, updateToastStatus, updateSession]);

  useEffect(() => {
    const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
    if (sessionFiles.length > 0 && fileList.length === 0) {
      setFileList(sessionFiles);
    }
  }, []);

  // ===============================
  // UI 렌더링
  // - 파일 선택/드래그앤드롭 영역
  // - 파일 목록 및 분석 버튼/진행률
  // - 업로드 개수 안내
  // ===============================
  return (
    <div>
      {/* 파일 선택 및 드래그앤드롭 영역 */}
      <FileUploadView
        fileList={fileList}
        fileinputRef={fileInputRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onFileChange={handleFileChange}
        uploadProgress={onUploadProgress}
        multiple
      />

      {/* 업로드된 파일 목록(미리보기), 분석 버튼, 진행률 표시 */}
      <FileUploadPreviewList
        fileList={fileList}
        setFileList={setFileList}
        isLoggedIn={isLoggedIn}
        remainingInfo={remainingInfo}
        progressMap={progressMap}
        onAnalyzeFile={(file) => handleAnalyzeFileClick(file)}
        onDeleteFile={handleFileDelete}
      />

      {/* 업로드 카운트 및 제한 안내 */}
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