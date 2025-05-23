/**
 * analysisId를 기반으로 sessionStorage와 localStorage에서 해당 분석 파일을 삭제하고,
 * 관련된 분석 결과 데이터도 함께 localStorage와 sessionStorage에서 제거합니다.
 * 
 * @param {string} analysisId - 삭제할 파일의 고유 분석 ID
 */
export function deleteFileFromSessionAndLocal(analysisId) {
  // sessionStorage에서 해당 analysisId를 가진 파일 목록 필터링 후 저장
  const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
  const updatedSession = sessionFiles.filter(f => f.analysis_id !== analysisId);
  sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedSession));
  sessionStorage.setItem("uploadedCount", String(updatedSession.length));

  // localStorage에서도 동일한 방식으로 해당 파일 제거
  const localFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
  const updatedLocal = localFiles.filter(f => f.analysis_id !== analysisId);
  localStorage.setItem("uploadedFiles", JSON.stringify(updatedLocal));

  // 해당 analysisId 키로 저장된 분석 결과 데이터 제거 (localStorage와 sessionStorage 모두)
  localStorage.removeItem(analysisId);
  sessionStorage.removeItem(analysisId);

  // 마지막으로 본 분석 결과 ID도 삭제
  if (sessionStorage.getItem("lastViewedAnalysisId") === analysisId) {
    sessionStorage.removeItem("lastViewedAnalysisId");
  }
}

/**
 * 파일 이름과 크기를 기준으로 sessionStorage와 localStorage에서 해당 파일을 삭제합니다.
 * 
 * @param {string} name - 삭제할 파일의 이름
 * @param {number} size - 삭제할 파일의 크기 (바이트 단위)
 */
export function deleteFileByNameAndSize(name, size) {
  // 지정된 스토리지(sessionStorage 또는 localStorage)에서 해당 이름과 크기의 파일을 필터링하여 제거
  const removeMatchingFile = (storage) => {
    const list = JSON.parse(storage.getItem("uploadedFiles") || "[]");
    const updated = list.filter(f => !(f.name === name && f.size === size));
    storage.setItem("uploadedFiles", JSON.stringify(updated));
    storage.setItem("uploadedCount", String(updated.length));
  };

  removeMatchingFile(sessionStorage);
  removeMatchingFile(localStorage);
}

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

/**
 * 업로드 세션 상태 관리 훅
 * 
 * 이 훅은 파일 업로드 목록을 관리하며, sessionStorage와 localStorage 간의 동기화를 담당합니다.
 * - 업로드된 파일 목록을 상태로 관리
 * - 새로고침, 다른 탭 열기 등에서도 동일한 업로드 목록을 유지
 * - 로그인 상태에 따라 저장 및 표시되는 파일 개수 제한 적용
 * - 분석 결과가 존재하는 경우 파일 상태를 'done'으로 업데이트
 * 
 * @param {function} isActuallyLoggedIn - 현재 사용자의 로그인 상태를 반환하는 함수
 * @param {number} maxCount - 비로그인 상태에서 저장할 수 있는 최대 파일 개수 제한
 * 
 * @returns {[Array, Function, Function]} 파일 목록 상태, 상태 변경 함수, 세션 업데이트 함수
 */
export function useUploadSession(isActuallyLoggedIn, maxCount) {
  const [fileList, setFileList] = useState([]);

  // 컴포넌트 마운트 시 초기 로딩 및 동기화 작업 수행
  useEffect(() => {
    // sessionStorage에서 저장된 업로드 파일 목록과 업로드 시간을 불러옴
    const savedFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
    const uploadedTime = parseInt(sessionStorage.getItem("uploadedTime") || "0", 10);
    const now = Date.now();

    // localStorage에 analysis_id 키 형식으로 저장된 파일 정보도 수집
    const localResults = [];
    Object.keys(localStorage).forEach((key) => {
      if (/^[0-9a-fA-F\-]{36}$/.test(key)) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key));
          if (
            parsed &&
            typeof parsed === 'object' &&
            parsed.analysis_id &&
            parsed.display_name !== null &&
            parsed.file_size &&
            (parsed.filename || parsed.name)
          ) {
            const parsedName = parsed.filename || parsed.display_name || parsed.name;
            const alreadyExists = savedFiles.some(f =>
              f.analysis_id === parsed.analysis_id ||
              (f.name === parsedName && f.size === parsed.file_size)
            );
            if (!alreadyExists) {
              localResults.push({
                ...parsed,
                status: 'done',
                name: parsedName,
              });
            }
          }
        } catch {}
      }
    });

    const updatedFiles = [...savedFiles, ...localResults].map((file) => {
      // localStorage와 sessionStorage에서 해당 파일의 분석 결과 데이터 조회
      const rawLocal = file.analysis_id ? localStorage.getItem(file.analysis_id) : null;
      const rawSession = file.analysis_id ? sessionStorage.getItem(file.analysis_id) : null;
      const parsedRaw = rawLocal || rawSession;

      if (parsedRaw && parsedRaw !== "null" && parsedRaw.trim() !== "") {
        try {
          const parsed = JSON.parse(parsedRaw);
          if (parsed.display_name === null) {
            // 로컬스토리지/세션스토리지에서 해당 키 제거
            localStorage.removeItem(file.analysis_id || "");
            sessionStorage.removeItem(file.analysis_id || "");
            return null; // 이 항목은 렌더링하지 않음
          }
          // 분석 결과 JSON 파싱 및 상태, 결과 텍스트, 분석 관련 메타데이터 설정
          let resultValue = '분석 완료';
          if (typeof parsed.result === 'string' && parsed.result !== '[object Object]') {
            resultValue = parsed.result;
          } else if (typeof parsed.malicious === 'number') {
            if (parsed.malicious >= 0.9) {
              resultValue = '악성';
            } else if (parsed.malicious >= 0.6) {
              resultValue = '의심';
            } else {
              resultValue = '정상';
            }
          } else if (parsed.log) {
            resultValue = '분석 완료';
          } else {
            resultValue = '분석 안됨';
          }
          return {
            ...file,
            status: "done",
            result: resultValue,
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
          // 분석 결과 파싱 실패 시 상태만 'done'으로 표시
          return { ...file, status: "done" };
        }
      }

      // localStorage에 해당 analysis_id 키가 존재하면 상태를 'done'으로 업데이트
      if (localStorage.getItem(file.analysis_id || "")) {
        return { ...file, status: "done" };
      }

      // 분석 결과가 없으면 기존 파일 상태 유지
      return file;
    });

    const filteredFiles = updatedFiles.filter(f => f !== null);

    // 중복 제거: analysis_id 기준
    const dedupedFiles = Array.from(
      new Map(filteredFiles.map(f => [f.analysis_id, f])).values()
    );

    // 비로그인 상태에서 업로드 시간이 24시간(86400000ms) 이상 경과한 경우 저장된 데이터 초기화
    if (!isActuallyLoggedIn()) {
      if (now - uploadedTime > 86400000) {
        sessionStorage.removeItem("uploadedFiles");
        sessionStorage.removeItem("uploadedCount");
        sessionStorage.removeItem("uploadedTime");
        setFileList([]);
      } else {
        // 비로그인 상태에서 최대 개수 제한을 적용하여 파일 목록 설정
        setFileList(dedupedFiles.slice(0, maxCount));
      }
    } else {
      // 로그인 상태에서는 모든 파일 목록을 그대로 설정
      setFileList(dedupedFiles);
    }

    /**
     * 다른 탭 또는 윈도우에서 localStorage가 변경되었을 때 호출되어
     * localStorage와 sessionStorage 간의 파일 목록 동기화를 수행합니다.
     */
    const syncFromLocalStorage = () => {
      const files = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
      const uploadedTime = parseInt(localStorage.getItem("uploadedTime") || String(Date.now()), 10);
      const existingIds = new Set((fileList || []).map(f => f.analysis_id));
      const trimmed = files.filter(file =>
        !existingIds.has(file.analysis_id) &&
        file.analysis_id && typeof file.analysis_id === "string" &&
        file.display_name !== null && file.display_name !== undefined &&
        (file.filename || file.name)
      );
      const merged = [...fileList];
      trimmed.forEach((file) => {
        if (!merged.some(f =>
          f.analysis_id === file.analysis_id ||
          (f.name === file.name && f.size === file.size)
        )) {
          merged.push(file);
        }
      });
      setFileList(merged);
      sessionStorage.setItem("uploadedFiles", JSON.stringify(merged));
      sessionStorage.setItem("uploadedCount", String(merged.length));
      sessionStorage.setItem("uploadedTime", String(uploadedTime));
    };

    // storage 이벤트(다른 탭에서 localStorage 변경)와 커스텀 이벤트 수신 대기
    window.addEventListener("storage", syncFromLocalStorage);
    window.addEventListener("fileListUpdated", syncFromLocalStorage);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", syncFromLocalStorage);
      window.removeEventListener("fileListUpdated", syncFromLocalStorage);
    };
  }, [isActuallyLoggedIn, maxCount]);

  /**
   * 새로 업로드된 파일 배열을 받아 UUID 기반의 고유 분석 ID 및 메타데이터를 포함한
   * 확장된 파일 객체 배열을 생성합니다.
   * 
   * @param {Array} newFiles - 새로 업로드된 파일 객체 배열
   * @returns {Array} 확장된 파일 객체 배열
   */
  // 수정 1: 이미 업로드된 파일이 존재하면 기존 analysis_id를 재사용하도록 변경
  const createEnhancedFiles = (newFiles) => {
    const existing = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
    return newFiles.map((file) => {
      const matched = existing.find(
        f => f.name === file.name && f.size === file.size && f.file?.lastModified === file.lastModified
      );
      return {
        analysis_id: matched?.analysis_id || uuidv4(),
        name: file.name || "이름 없는 파일",
        size: file.size || 0,
        type: file.type || "",
        extension: file.name?.split('.').pop() || '',
        status: "pending",
        uploadedAt: matched?.uploadedAt || new Date().toISOString(),
        file,
      };
    });
  };

  /**
   * 새로운 파일 배열을 받아 기존 파일 목록과 중복되지 않는 항목을 병합하여
   * sessionStorage와 localStorage에 저장하고 상태를 업데이트합니다.
   * 비로그인 상태에서는 maxCount 제한을 적용합니다.
   * 
   * @param {Array} newFiles - 새로 추가할 파일 객체 배열
   */
  const updateSession = (newFiles) => {
    const now = Date.now();
    const enhancedFiles = createEnhancedFiles(newFiles);

    // 기존 파일 목록에서 새로 추가할 파일과 analysis_id가 동일한 파일만 제거
    // (이름/크기만 같은 파일이 삭제되는 부작용 방지)
    const filtered = fileList.filter(f =>
      !enhancedFiles.some(e => e.analysis_id === f.analysis_id)
    );

    // 로그인 상태에 따라 저장할 파일 목록 결정 (비로그인은 maxCount 제한 적용)
    const updatedFiles = isActuallyLoggedIn()
      ? [...filtered, ...enhancedFiles]
      : [...filtered, ...enhancedFiles].slice(0, maxCount);

    // analysis_id 기준으로 중복 제거 (deduplication)
    const dedupedFiles = Array.from(
      new Map(updatedFiles.map(f => [f.analysis_id, f])).values()
    );

    // sessionStorage에 업데이트된 파일 목록과 관련 정보 저장
    sessionStorage.setItem("uploadedFiles", JSON.stringify(dedupedFiles));
    sessionStorage.setItem("uploadedCount", String(dedupedFiles.length));
    sessionStorage.setItem("uploadedTime", String(now));
    setFileList(dedupedFiles);

    // 수정 2: localStorage 저장 시 analysis_id를 기준으로 중복 제거
    const localList = JSON.parse(localStorage.getItem("uploadedFiles") || "[]").filter(
      f => !enhancedFiles.some(e => e.analysis_id === f.analysis_id)
    );
    const combinedLocal = isActuallyLoggedIn()
      ? [...localList, ...enhancedFiles]
      : [...localList, ...enhancedFiles].slice(0, maxCount);
    // deduplicate localStorage as well
    const dedupedLocal = Array.from(
      new Map(combinedLocal.map(f => [f.analysis_id, f])).values()
    );
    localStorage.setItem("uploadedFiles", JSON.stringify(dedupedLocal));
  };

  return [fileList, setFileList, updateSession];
}

/**
 * 마이페이지 등에서 sessionStorage에 저장된 업로드된 파일 목록을 안전하게 불러오는 유틸리티 함수입니다.
 * JSON 파싱 오류 발생 시 빈 배열을 반환하여 에러 방지합니다.
 * 
 * @returns {Array} sessionStorage에 저장된 업로드 파일 목록 배열 (없으면 빈 배열)
 */
export function getUploadedFilesFromSession() {
  try {
    const raw = sessionStorage.getItem("uploadedFiles");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}