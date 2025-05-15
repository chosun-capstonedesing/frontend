import React from "react";
import DragAndDrop from "./DragAndDrop";
import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";
import { useNavigate } from "react-router-dom";
import { getProgressBarInfo } from "../upload/handleAnalyzeFile";

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

      {/* 파일 업로드 중일 때 프로그레스 바 표시 */}
      {typeof uploadProgress === "number" && (
        <ProgressBar progress={uploadProgress} />
      )}
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

  const [latestCompleteIndex, setLatestCompleteIndex] = React.useState(null);
  const [validUntil, setValidUntil] = React.useState(null);

  React.useEffect(() => {
    const latestIndex = fileList.findLastIndex(file => file.status === "done");
    if (latestIndex !== -1) {
      setLatestCompleteIndex(latestIndex);
      setValidUntil(Date.now() + 30 * 60 * 1000); // 30분 타이머 설정
    }
  }, [fileList]);

  return (
    <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {/* 파일 리스트의 각 항목에 대해 표시 */}
      {fileList
        .map((file, i) => ({ file, originalIndex: i })) // 인덱스를 유지하기 위한 래핑
        .slice(-3) // 최근 3개만 표시
        .reverse() // 최신 순 정렬
        .map(({ file, originalIndex }) => (
          <li
            key={originalIndex}
            className="relative group p-3 flex flex-col space-y-2"
          >
            {/* 삭제 버튼 */}
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
                <p className="text-lg font-semibold text-black">{file.name}</p>
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
                  const isValid =
                    file.status === "done" &&
                    originalIndex === latestCompleteIndex &&
                    Date.now() <= validUntil;
                  if (isValid) {
                    navigate(`/analysis_results`);
                  } else if (file.status === "done") {
                    if (isLoggedIn) {
                      alert("분석 결과가 만료되었습니다. 마이페이지에서 확인해주세요.");
                    } else {
                      alert("분석 결과가 만료되었습니다. 로그인 후 마이페이지에서 히스토리를 확인할 수 있습니다.");
                    }
                  } else {
                    onAnalyzeFile(originalIndex);
                  }
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
                      detail: { fileIndex: originalIndex },
                    });
                    window.dispatchEvent(customCancelEvent);
                    onAnalyzeFile(originalIndex);
                  }}
                >
                  분석 중지
                </button>
              )}
            </div>
            
            {/* 프로그레스 바 시각화 영역 */}
            {progressMap[originalIndex] !== undefined && (
              <div className="w-full mt-2">
                {(() => {
                  const progress = Math.min(progressMap[originalIndex] ?? 0, 100);
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
        ))}
    </ul>
  );
}