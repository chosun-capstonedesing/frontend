import { v4 as uuidv4 } from "uuid";
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

    const updatedFiles = savedFiles.map((file) => {
      const raw = localStorage.getItem(file.analysis_id || "");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return {
            ...file,
            status: "done",
            result:
              typeof parsed.result === 'string' && parsed.result !== '[object Object]'
                ? parsed.result
                : typeof parsed.malicious === 'number'
                  ? parsed.malicious >= 0.6 ? '악성' : '정상'
                  : parsed.log ? '분석 완료'
                  : '분석 안됨',
            log: parsed.log,
            confidence: parsed.confidence,
            malicious: parsed.malicious,
            summary: typeof parsed.summary === 'string' ? parsed.summary : '',
            normal: parsed.normal,
            sha256: parsed.sha256,
            model_info: parsed.model_info,
            performance: parsed.performance,
            report_url: parsed.report_url,
            display_name: parsed.display_name,
            file_size: parsed.file_size,
            extension: parsed.extension,
          };
        } catch {
          return { ...file, status: "done" };
        }
      }
      return file;
    });

    if (!isActuallyLoggedIn()) {
      if (now - uploadedTime > 86400000) {
        sessionStorage.removeItem("uploadedFiles");
        sessionStorage.removeItem("uploadedCount");
        sessionStorage.removeItem("uploadedTime");
        setFileList([]);
      } else {
        setFileList(updatedFiles.slice(0, maxCount));
      }
    } else {
      setFileList(updatedFiles);
    }

    // storage, 커스텀 이벤트로 타 탭 변경사항 반영
    const syncFromLocalStorage = () => {
      const files = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
      const uploadedTime = parseInt(localStorage.getItem("uploadedTime") || String(Date.now()), 10);
      const trimmed = files.slice(0, maxCount).map((file) => {
        const result = localStorage.getItem(file.analysis_id || "");
        if (result) {
          return { ...file, status: "done" };
        }
        return file;
      });
      setFileList(trimmed);
      sessionStorage.setItem("uploadedFiles", JSON.stringify(trimmed));
      sessionStorage.setItem("uploadedCount", String(trimmed.length));
      sessionStorage.setItem("uploadedTime", String(uploadedTime));
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
      analysis_id: uuidv4(),
      name: file.name || "이름 없는 파일",
      size: file.size || 0,
      type: file.type || "",
      extension: file.name?.split('.').pop() || '',
      status: "pending",
      uploadedAt: new Date().toISOString(),
      file, // preserve original File object
    }));

    const filtered = fileList.filter(f =>
      !enhancedFiles.some(e => e.name === f.name && e.size === f.size)
    );
    const updatedFiles = isActuallyLoggedIn()
      ? [...filtered, ...enhancedFiles]
      : [...filtered, ...enhancedFiles].slice(0, maxCount);

    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    sessionStorage.setItem("uploadedCount", String(updatedFiles.length));
    sessionStorage.setItem("uploadedTime", String(now));
    setFileList(updatedFiles);

    // 로컬스토리지에도 동일하게 반영 (마이페이지 등 다른 탭 반영용)
    const combinedLocal = isActuallyLoggedIn()
      ? [...JSON.parse(localStorage.getItem("uploadedFiles") || "[]").filter(f =>
          !enhancedFiles.some(e => e.name === f.name && e.size === f.size)
        ), ...enhancedFiles]
      : [...JSON.parse(localStorage.getItem("uploadedFiles") || "[]").filter(f =>
          !enhancedFiles.some(e => e.name === f.name && e.size === f.size)
        ), ...enhancedFiles].slice(0, maxCount);
    localStorage.setItem("uploadedFiles", JSON.stringify(combinedLocal));
  };

  return [fileList, setFileList, updateSession];
}

// 마이페이지에서 세션 기반 업로드 결과를 불러오기 위한 유틸
export function getUploadedFilesFromSession() {
  try {
    const raw = sessionStorage.getItem("uploadedFiles");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}