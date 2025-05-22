import React from "react";
import { deleteFileFromSessionAndLocal } from "../../../features/analysis/components/useUploadSession";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import { useNavigate } from "react-router-dom";
import { getProgressBarInfo } from "./handleAnalyzeFile";

// 파일 업로드 뷰 컴포넌트 - 드래그앤드롭과 업로드 프로그레스바 포함
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
      {/* 파일을 드래그하거나 클릭하여 선택하는 입력 영역 */}
      <DragAndDrop onDrop={onDrop} onDragOver={onDragOver}>
        <FileInput
          onFileChange={onFileChange}
          inputRef={fileinputRef}
          id="file-upload-input"
          multiple
        />
      </DragAndDrop>
    </div>
  );
}

export default FileUploadView;

// 파일 목록을 프리뷰로 보여주는 컴포넌트
export function FileUploadPreviewList({
  fileList,
  setFileList,
  isLoggedIn,
  remainingInfo,
  progressMap,
  onAnalyzeFile,
}) {
  const navigate = useNavigate();


  const parseResultFromLocalStorage = (analysisId) => {
    for (const key in localStorage) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.analysis_id === analysisId) {
          const result =
            typeof item.result === "string"
              ? item.result
              : typeof item.malicious === "number"
              ? item.malicious >= 0.9
                ? "악성"
                : item.malicious >= 0.6
                ? "의심"
                : "정상"
              : item.log
              ? "분석 완료"
              : "분석 안됨";

          return { parsed: item, result };
        }
      } catch (_) {}
    }
    return null;
  };

  const updateSessionWithParsedResult = (file, parsed, result, status = undefined) => {
    const sessionFilesRaw = sessionStorage.getItem("uploadedFiles") || "[]";
    let sessionFiles = JSON.parse(sessionFilesRaw);

    // deduplicate by analysis_id before updating
    const uniqueSessionFiles = [];
    const seenIds = new Set();
    for (const f of sessionFiles) {
      if (!seenIds.has(f.analysis_id)) {
        uniqueSessionFiles.push(f);
        seenIds.add(f.analysis_id);
      }
    }
    sessionFiles = uniqueSessionFiles;

    const updatedSession = sessionFiles.map((f) =>
      f.analysis_id === file.analysis_id
        ? { ...f, ...parsed, result, ...(status && { status }) }
        : f
    );
    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedSession));
    return updatedSession;
  };

  // deduplicate and filter using localStorage and sessionStorage presence
  const allKeys = Object.keys(localStorage);
  let filteredFileList = fileList
    .filter(file => {
      if (!file || !file.analysis_id || !file.name || file.name === "이름 없는 파일") return false;
      // Check localStorage keys
      const inLocalStorageKey = allKeys.includes(file.analysis_id);
      // Check localStorage values for analysis_id
      const inLocalStorageValue = Object.values(localStorage).some(val => {
        try {
          const parsed = JSON.parse(val);
          return parsed?.analysis_id === file.analysis_id;
        } catch {
          return false;
        }
      });
      // Check sessionStorage uploadedFiles for analysis_id
      const uploadedFilesStr = sessionStorage.getItem("uploadedFiles");
      const inSessionStorage =
        uploadedFilesStr && uploadedFilesStr.includes(file.analysis_id);
      return inLocalStorageKey || inLocalStorageValue || inSessionStorage;
    })
    .map(file => {
      const parsedRaw = localStorage.getItem(file.analysis_id);
      if (parsedRaw) {
        try {
          const parsed = JSON.parse(parsedRaw);
          const result =
            typeof parsed.result === 'string'
              ? parsed.result
              : typeof parsed.malicious === 'number'
              ? parsed.malicious >= 0.9
                ? '악성'
                : parsed.malicious >= 0.6
                ? '의심'
                : '정상'
              : parsed.log
              ? '분석 완료'
              : '분석 안됨';
          return {
            ...file,
            status: 'done',
            result,
            ...parsed
          };
        } catch (_) {}
      }
      return file;
    })
    .filter((file, idx, self) =>
      self.findIndex(f => f.analysis_id === file.analysis_id) === idx
    );

  // Fallback: if fileList not empty but filteredFileList is empty, show all
  if (fileList.length > 0 && filteredFileList.length === 0) {
    filteredFileList = [...fileList];
  }

  return (
    <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {/* 파일 리스트의 각 항목에 대해 표시 */}
      {filteredFileList
        .map((file, i) => ({ file, originalIndex: i })) // 인덱스를 유지하기 위한 래핑
        .slice(-3) // 최근 3개만 표시
        .reverse() // 최신 순 정렬
        .map(({ file, originalIndex }) => {
          // --- localStorage 상태 반영 로직 추가 시작 ---
          const parsedRaw = localStorage.getItem(file.analysis_id || "");
          if (parsedRaw) {
            try {
              const parsed = JSON.parse(parsedRaw);
              if (parsed.log !== undefined || parsed.result !== undefined) {
                const result =
                  typeof parsed.result === 'string'
                    ? parsed.result
                    : typeof parsed.malicious === 'number'
                    ? parsed.malicious >= 0.9
                      ? '악성'
                      : parsed.malicious >= 0.6
                      ? '의심'
                      : '정상'
                    : parsed.log
                    ? '분석 완료'
                    : '분석 안됨';
                file = {
                  ...file,
                  status: "done",
                  result,
                  ...parsed
                };
              }
            } catch (_) {}
          }
          // --- localStorage 상태 반영 로직 추가 끝 ---
          if (!file || !file.name || file.name === "이름 없는 파일") return null;
          return (
            <li
              key={file.analysis_id}
              className="relative group p-3 flex flex-col space-y-2"
            >
            {/* 삭제 버튼 */}
            <button
              onClick={() => {
                deleteFileFromSessionAndLocal(file.analysis_id);
                // 로컬/세션 스토리지에서 해당 analysis_id를 값으로 가진 키도 삭제
                for (const key in localStorage) {
                  try {
                    const val = JSON.parse(localStorage.getItem(key));
                    if (val?.analysis_id === file.analysis_id) {
                      localStorage.removeItem(key);
                    }
                  } catch (_) {}
                }
                for (const key in sessionStorage) {
                  try {
                    const val = JSON.parse(sessionStorage.getItem(key));
                    if (val?.analysis_id === file.analysis_id) {
                      sessionStorage.removeItem(key);
                    }
                  } catch (_) {}
                }
                const updated = [...fileList];
                updated.splice(originalIndex, 1);
                setFileList(updated);
                sessionStorage.setItem("uploadedFiles", JSON.stringify(updated));
                window.dispatchEvent(new Event("fileListUpdated"));
              }}
              className="absolute -top-2 -left-2 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="파일 삭제"
            >
              {/* 삭제 아이콘 (X) */}
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

            {/* 파일명, 업로드 시간, 분석 버튼 영역 */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {/* 상태 아이콘 - 완료(초록) / 진행중(노랑) */}
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

              {/* 파일 이름과 업로드 날짜, 크기 표시 */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-black break-all whitespace-pre-wrap max-w-full">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {file.uploadedAt || new Date().toLocaleDateString()} ·{" "}
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              {/* 분석 상태에 따라 버튼 스타일 및 텍스트 변경 */}
              <button
                className={`ml-4 text-sm font-medium px-3 py-1 rounded 
                  ${
                    file.status === "done"
                      ? "bg-green-100 text-green-700 hover:-green-200"
                      : file.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                onClick={() => {
                  if (file.status === "processing") return; // 분석 중 버튼은 동작 없음
                  const parsedResult = parseResultFromLocalStorage(file.analysis_id);
                  if (parsedResult) {
                    navigate(`/analysis_results/${file.analysis_id}`);
                    return;
                  }
                  if ((progressMap[file.analysis_id] ?? 0) >= 100) {
                    if (parsedResult) {
                      const { parsed, result } = parsedResult;
                      if (file) {
                        const updatedSession = updateSessionWithParsedResult(file, parsed, result, 'done');
                        setFileList(updatedSession);
                        return;
                      }
                    } else {
                      const updated = fileList.map(f =>
                        f.analysis_id === file.analysis_id
                          ? { ...f, status: "done", result: "분석 완료" }
                          : f
                      );
                      sessionStorage.setItem("uploadedFiles", JSON.stringify(updated));
                      setFileList(updated);
                      return;
                    }
                  }
                  onAnalyzeFile(file.analysis_id);
                }}
              >
                {file.status === "done"
                  ? "분석 완료"
                  : file.status === "processing"
                  ? "분석 중"
                  : "분석하기"}
              </button>
              {file.status === "processing" && (
                <button
                  className="ml-2 text-xs text-red-500 hover:underline"
                  onClick={() => {
                    // 중지 처리를 위해 toast 상태와 백엔드 분석을 모두 취소
                    const customCancelEvent = new CustomEvent("cancelAnalysis", {
                      detail: { analysisId: file.analysis_id },
                    });
                    window.dispatchEvent(customCancelEvent);
                    onAnalyzeFile(file.analysis_id);
                  }}
                >
                  분석 중지
                </button>
              )}
            </div>
            
            {/* 프로그레스 바 시각화 영역 */}
            {progressMap[file.analysis_id] !== undefined && (
              <div className="w-full mt-2">
                {(() => {
                  const progress = Math.min(progressMap[file.analysis_id] ?? 0, 100);
                  const { label, labelColor, barColor } = getProgressBarInfo(file.status, progress);

                  return (
                    <>
                      <div className={`text-xs mb-1 ${labelColor}`}>{label}</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-[200ms] ease-linear ${barColor}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {`${Math.floor(progress)}%`}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </li>
          );
        })}
    </ul>
  );
}