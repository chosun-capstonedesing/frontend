import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import FileUploadView from "./FileUploadView";
import { isLoggedIn } from "../../utils/isLoggedIn";
import { useToast } from "../../context/ToastContext";

/**
 * 파일 업로드 로직(컨테이너) 컴포넌트
 * -> 상태 및 이벤트 핸들러 담당
 * 
 * - onFileSelect : 파일 선택(또는 드롭) 시 상위에 파일 객체 전달
 * - onUploadProgress: 업로드 진행률(%) 표시
 */

function FileUpload({ onFileSelect, onUploadProgress }) {
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef();
  const analysisTimers = useRef({});

  const { showToast, updateProgress, updateToastStatus } = useToast();
  const [progressMap, setProgressMap] = useState({});

  // ✅ client_uuid 쿠키 생성 및 도메인 명시적으로 설정
  useEffect(() => {
    if (!document.cookie.includes("client_uuid")) {
      const uuid = crypto.randomUUID();
      document.cookie = `client_uuid=${uuid}; path=/; max-age=86400`;
      console.log("✅ client_uuid 쿠키 생성됨:", uuid);
    }
  }, []);

  const isActuallyLoggedIn = () => {
    if (import.meta.env.DEV) {
      return true; // 개발 중 사용자 상태 설정 (파일 업로드 제한 기능에만 영향) -> true / false
    }
    return isLoggedIn();
  };

  const maxCount = isActuallyLoggedIn() ? Infinity : 3;
  const [remainingInfo, setRemainingInfo] = useState(null);
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const response = await axios.get("/api/limit/upload-remaining", {
          withCredentials: true,
        });
        setRemainingInfo(response.data);
      } catch (err) {
        console.error("업로드 횟수 조회 실패", err);
      }
    };
    fetchRemaining();
  }, []);

  // ✅ 새로고침에도 비로그인 업로드 제한 수 유지 (24시간 제한 적용)
  useEffect(() => {
    const savedFiles = JSON.parse(sessionStorage.getItem('uploadedFiles') || '[]');
    const uploadedTime = parseInt(sessionStorage.getItem('uploadedTime') || '0', 10);
    const now = Date.now();

    if (!isActuallyLoggedIn()) {
      if (now - uploadedTime > 86400000) {
        sessionStorage.removeItem('uploadedFiles');
        sessionStorage.removeItem('uploadedCount');
        sessionStorage.removeItem('uploadedTime');
        setFileList([]);
      } else {
        setFileList(savedFiles.slice(0, maxCount));
      }
    } else {
      setFileList(savedFiles); // 로그인 사용자는 그냥 유지
    }

    // Listen for storage and custom fileListUpdated events to sync fileList (e.g., after deleting file from MyPage)
    const syncFromLocalStorage = () => {
      const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      const trimmed = files.slice(0, maxCount);
      setFileList(trimmed);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(trimmed));
      sessionStorage.setItem('uploadedCount', String(trimmed.length));
    };
    window.addEventListener("storage", syncFromLocalStorage);
    window.addEventListener("fileListUpdated", syncFromLocalStorage);
    return () => {
      window.removeEventListener("storage", syncFromLocalStorage);
      window.removeEventListener("fileListUpdated", syncFromLocalStorage);
    };
  }, []);


  const updateSession = (newFiles) => {
    const now = Date.now();
    const enhancedFiles = newFiles.map((file) => ({
      file, // 실제 File 객체 포함
      name: file.name,
      size: file.size,
      status: "pending",
      uploadedAt: new Date().toLocaleString()
    }));

    const updatedFiles = [...fileList, ...enhancedFiles].slice(0, maxCount);

    // Update sessionStorage
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    sessionStorage.setItem('uploadedCount', String(updatedFiles.length));
    sessionStorage.setItem('uploadedTime', String(now));
    setFileList(updatedFiles);

    // Also update localStorage to persist across sessions (used in MyPage)
    const localSaved = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
    const combinedLocal = [...localSaved, ...enhancedFiles].slice(0, 50); // Optional limit
    localStorage.setItem("uploadedFiles", JSON.stringify(combinedLocal));
  };

  // 파일 선택 시 처리
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (fileList.length + selectedFiles.length > maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }

    updateSession(selectedFiles);
    onFileSelect?.(selectedFiles);
  };

  // 드래그 앤 드롭 시 처리
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (fileList.length + droppedFiles.length > maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
      return;
    }

    updateSession(droppedFiles);
    onFileSelect?.(droppedFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleAnalyzeFile = (index) => {
    // 쿠키 상태 로그
    console.log("📦 현재 document.cookie:", document.cookie);
    const updatedFiles = [...fileList];
    const currentStatus = updatedFiles[index].status;

    if (currentStatus === "processing") {
      // 중지: 타이머 취소하고 상태 복구
      clearTimeout(analysisTimers.current[index]?.timeoutId);
      clearInterval(analysisTimers.current[index]?.intervalId);
      updatedFiles[index].status = "pending";
      setFileList(updatedFiles);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      setProgressMap(prev => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });
      return;
    }

    // 시작: 상태 변경 및 타이머 등록
    updatedFiles[index].status = "processing";
    setFileList(updatedFiles);
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    setProgressMap(prev => ({ ...prev, [index]: 0 }));

    showToast(`${updatedFiles[index].name}`, "processing", index);

    const intervalId = setInterval(() => {
      setProgressMap(prev => {
        const current = prev[index] || 0;
        if (current >= 100) {
          clearInterval(intervalId);
          return prev;
        }
        updateProgress(index, current + 5);
        return { ...prev, [index]: current + 5 };
      });
    }, 100);

    const timeoutId = setTimeout(async () => {
      updatedFiles[index].status = "done";
      setFileList([...updatedFiles]);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      clearInterval(intervalId);
      delete analysisTimers.current[index];
      setProgressMap(prev => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });

      // 🔽 파일 분석 요청 (Content-Type은 axios가 자동 설정)
      // 실제 file 객체로 대체 필요
      const formData = new FormData();
      const realFile = updatedFiles[index].file instanceof File
        ? updatedFiles[index].file
        : new File([], updatedFiles[index].name);
      formData.append("file", realFile);
      const updateLocalStorageResult = (fileName, result) => {
        const localFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
        const updatedLocal = localFiles.map(file => {
          if (file.name === fileName) {
            return { ...file, result };
          }
          return file;
        });
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedLocal));
      };
      try {
        const token = localStorage.getItem("access_token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        console.log([...formData.entries()]); // Debug formData content
        await axios.post("/api/analyze-full", formData, {
          headers,
          withCredentials: true,
        })
          .then(res => {
            console.log("분석 결과:", res.data);
            // 응답 결과를 localStorage에도 반영
            updateLocalStorageResult(updatedFiles[index].name, res.data.result);
          })
          .catch(err => {
            if (err.response) {
              console.error("파일 분석 요청 실패:", err.response.status, err.response.data);
            } else {
              console.error("파일 분석 요청 실패:", err.message);
            }
            showToast(`${updatedFiles[index].name} 분석 실패`, "error", index);
          });
      } catch (err) {
        console.error("파일 분석 요청 중 예외 발생:", err);
        showToast(`${updatedFiles[index].name} 분석 실패`, "error", index);
      }
    }, 2000);

    analysisTimers.current[index] = { timeoutId, intervalId };
  };

  useEffect(() => {
    fileList.forEach((file, index) => {
      if (file.status === 'done') {
        updateToastStatus(index);
      }
    });
  }, [fileList]);

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

      {/* ✅ 최근 업로드된 파일 3개 미리보기 */}
      <div className="mt-6 w-full">
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {fileList
            .map((file, i) => ({ file, originalIndex: i }))
            .slice(-3)
            .reverse()
            .map(({ file, originalIndex }) => (
              <li key={originalIndex} className="relative group p-3 flex flex-col space-y-2">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {(file.status || "done") === "done" ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-black">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.uploadedAt || new Date().toLocaleDateString())} · {file.size ? (file.size / 1024).toFixed(2) : "0.00"} KB
                    </p>
                  </div>
                  <button
                    className={`ml-4 text-sm font-medium px-3 py-1 rounded 
                                        ${file.status === 'done' ? 'bg-green-100 text-green-700' :
                        file.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    disabled={file.status === 'done'}
                    onClick={() => handleAnalyzeFile(originalIndex)}
                  >
                    {file.status === 'done'
                      ? '분석 완료'
                      : file.status === 'processing'
                        ? '분석 중'
                        : '분석하기'}
                  </button>
                </div>
                {file.status === 'processing' && (
                  <div className="w-full mt-2">
                    <div className="text-xs text-yellow-600 mb-1">분석 중...</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 bg-yellow-400 rounded-full transition-all duration-200"
                          style={{ width: `${progressMap[originalIndex] || 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{progressMap[originalIndex] || 0}%</div>
                    </div>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>

      {/* ✅ 업로드한 파일 수 표시 */}
      {remainingInfo && (
        <div className="mt-2 text-sm text-center text-gray-500">
          업로드 파일 수: {isActuallyLoggedIn()
            ? `${fileList.length} / 제한 없음`
            : `${remainingInfo.remaining} / ${remainingInfo.limit}`}
        </div>
      )}
    </div>
  );
}

export default FileUpload;