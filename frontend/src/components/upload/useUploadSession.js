import { useState, useEffect } from "react";

/**
 * 업로드 세션 상태 관리 훅
 * - 파일 목록을 sessionStorage와 localStorage에 저장/동기화
 * - 새로고침, 다른 탭 열기 등에서도 동일한 목록 유지
 */
export function useUploadSession(isActuallyLoggedIn, maxCount) {
  const [fileList, setFileList] = useState([]);

  // 초기 로딩: sessionStorage에서 목록 불러오기
  useEffect(() => {
    const savedFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
    const uploadedTime = parseInt(sessionStorage.getItem("uploadedTime") || "0", 10);
    const now = Date.now();

    // 비로그인 유저의 경우 24시간 지난 데이터 초기화
    if (!isActuallyLoggedIn()) {
      if (now - uploadedTime > 86400000) {
        sessionStorage.removeItem("uploadedFiles");
        sessionStorage.removeItem("uploadedCount");
        sessionStorage.removeItem("uploadedTime");
        setFileList([]);
      } else {
        setFileList(savedFiles.slice(0, maxCount));
      }
    } else {
      setFileList(savedFiles); // 로그인 시 제한 없이 전체 파일 유지
    }

    // storage, 커스텀 이벤트로 타 탭 변경사항 반영
    const syncFromLocalStorage = () => {
      const files = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
      const trimmed = files.slice(0, maxCount);
      setFileList(trimmed);
      sessionStorage.setItem("uploadedFiles", JSON.stringify(trimmed));
      sessionStorage.setItem("uploadedCount", String(trimmed.length));
    };

    window.addEventListener("storage", syncFromLocalStorage);
    window.addEventListener("fileListUpdated", syncFromLocalStorage);

    return () => {
      window.removeEventListener("storage", syncFromLocalStorage);
      window.removeEventListener("fileListUpdated", syncFromLocalStorage);
    };
  }, [isActuallyLoggedIn, maxCount]);

  // 파일 목록을 세션/로컬스토리지에 반영
  const updateSession = (newFiles) => {
    const now = Date.now();
    const enhancedFiles = newFiles.map((file) => ({
      name: file.name || "이름 없는 파일",
      size: file.size || 0,
      type: file.type || "",
      status: "pending",
      uploadedAt: new Date().toISOString(),
      file, // preserve original File object
    }));

    const updatedFiles = isActuallyLoggedIn()
      ? [...fileList, ...enhancedFiles]
      : [...fileList, ...enhancedFiles].slice(0, maxCount);

    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    sessionStorage.setItem("uploadedCount", String(updatedFiles.length));
    sessionStorage.setItem("uploadedTime", String(now));
    setFileList(updatedFiles);

    // 로컬스토리지에도 동일하게 반영 (마이페이지 등 다른 탭 반영용)
    const combinedLocal = isActuallyLoggedIn()
      ? [...JSON.parse(localStorage.getItem("uploadedFiles") || "[]"), ...enhancedFiles]
      : [...JSON.parse(localStorage.getItem("uploadedFiles") || "[]"), ...enhancedFiles].slice(0, maxCount);
    localStorage.setItem("uploadedFiles", JSON.stringify(combinedLocal));
  };

  return [fileList, setFileList, updateSession];
}