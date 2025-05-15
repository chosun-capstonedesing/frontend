import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

// ✅ ToastContext 생성 - 전역에서 알림을 호출/관리하기 위해 사용
const ToastContext = createContext();

// ✅ useToast: 다른 컴포넌트에서 토스트 함수를 쉽게 사용하기 위한 커스텀 훅
export const useToast = () => useContext(ToastContext);

// ✅ ToastProvider: 알림 상태와 렌더링을 제공하는 Context Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // ✅ showToast: 새 토스트 알림을 추가하는 함수
  const showToast = (message, status = "done", fileIndex = null, progress = 0) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, status, fileIndex, progress }]);
  };

  // ✅ updateProgress: 진행 중인 토스트의 퍼센트를 업데이트
  const updateProgress = (fileIndex, progress) => {
    setToasts(prev =>
      prev.map(t =>
        t.fileIndex === fileIndex && t.status === "processing"
          ? { ...t, progress }
          : t
      )
    );
  };

  // ✅ updateToastStatus: 분석 중에서 완료 상태로 변경하고 퍼센트를 100%로 설정
  const updateToastStatus = (fileIndex, status = "done") => {
    setToasts(prev =>
      prev.map(t =>
        t.fileIndex === fileIndex && t.status === "processing"
          ? { ...t, status, progress: 100 }
          : t
      )
    );
  };

  // ✅ cancelToastStatus: 분석 중 상태를 즉시 "cancelled"로 바꿔줌
  const cancelToastStatus = (fileIndex) => {
    setToasts(prev =>
      prev.map(t =>
        t.fileIndex === fileIndex && t.status === "processing"
          ? { ...t, status: "cancelled" }
          : t
      )
    );
  };

  // ✅ removeToast: 사용자가 수동으로 알림을 제거할 때 사용
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ✅ Listen for custom cancelAnalysis event to sync cancel from file list
  useEffect(() => {
    const handleCancelAnalysis = (e) => {
      const { fileIndex } = e.detail;
      cancelToastStatus(fileIndex);
    };
    window.addEventListener("cancelAnalysis", handleCancelAnalysis);
    return () => {
      window.removeEventListener("cancelAnalysis", handleCancelAnalysis);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, updateProgress, updateToastStatus, cancelToastStatus }}>
      {children}
      {/* ✅ createPortal: 알림을 최상위 DOM(body)에 렌더링 */}
      {createPortal(
        <div className="fixed top-20 right-5 space-y-3 z-50">
          {toasts.map((toast) => (
            // ✅ 알림 카드: 상태에 따라 테두리와 색상 변경
            <div
              key={toast.id}
              className={`relative w-72 bg-white shadow-md rounded-md p-3 
                ${toast.status === 'done' 
                  ? 'border border-green-200' 
                  : toast.status === 'cancelled' 
                  ? 'border border-red-200' 
                  : 'border border-yellow-300'}`}
            >
              {/* ✅ 닫기 버튼: 알림 수동 제거용 */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center shadow"
                aria-label="닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center space-x-2">
                {/* ✅ 아이콘 표시: 완료, 중지, 진행 중 상태에 따른 아이콘 및 배경 색상 */}
                <div className={`${toast.status === 'done' ? 'bg-green-100' : toast.status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'} p-1.5 rounded-full`}>
                  {toast.status === "done" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : toast.status === "cancelled" ? (
                    <ClockIcon className="h-5 w-5 text-red-500 rotate-45" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {toast.status === "done"
                      ? "분석 완료"
                      : toast.status === "cancelled"
                      ? "분석 중지됨"
                      : "분석 중"}
                  </p>

                  <div className="text-xs text-gray-600">{toast.message}</div>

                  {/* ✅ 분석 중일 때: 프로그래스 바 표시 */}
                  {toast.status === "processing" && (
                    <div className="w-full mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${toast.progress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">{toast.progress || 0}%</div>
                      </div>
                      
                      {/* ✅ 분석 중 상태일 때: 중지 버튼 표시 */}
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => cancelToastStatus(toast.fileIndex)}
                          className="text-xs text-red-500 font-medium hover:underline"
                        >
                          분석 중지
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ✅ 분석 완료일 때: 결과 보기 링크 표시 */}
                  {toast.status === "done" && (
                    <p className="text-xs text-green-600 mt-1 font-medium cursor-pointer hover:underline">
                      결과 보기 →
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};