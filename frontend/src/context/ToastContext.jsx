import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// Utility functions for status checks
const isProcessing = (status) => status === 'processing';
const isDone = (status) => status === 'done';
const isCancelled = (status) => status === 'cancelled';

// ✅ ToastContext 생성 - 전역에서 알림을 호출/관리하기 위해 사용
const ToastContext = createContext();

// ✅ useToast: 다른 컴포넌트에서 토스트 함수를 쉽게 사용하기 위한 커스텀 훅
export const useToast = () => useContext(ToastContext);

// ✅ ToastProvider: 알림 상태와 렌더링을 제공하는 Context Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  // ✅ showToast: 새 토스트 알림을 추가하는 함수
  const showToast = (message, status = "done", analysisId = null, progress = 0) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, status, analysisId, progress }]);
  };

  // ✅ updateProgress: 진행 중인 토스트의 퍼센트를 업데이트
  const updateProgress = (analysisId, progress) => {
    setToasts(prev =>
      prev.map(t =>
        t.analysisId === analysisId && isProcessing(t.status)
          ? { ...t, progress }
          : t
      )
    );
  };

  // ✅ updateToastStatus: 분석 완료 상태로 변경하고 퍼센트를 100%로 설정 (상태에 상관없이 업데이트)
  const updateToastStatus = (analysisId, status = "done") => {
    setToasts(prev =>
      prev.map(t =>
        t.analysisId === analysisId
          ? { ...t, status, progress: 100 }
          : t
      )
    );
    console.log("[Toast Sync] Updated toast status:", analysisId, status);

    // 추가: 분석 완료 상태를 다른 컴포넌트에 알림
    const event = new CustomEvent("toastStatusUpdated", { detail: { analysisId, status } });
    window.dispatchEvent(event);

    // ✅ 3분 후 자동으로 toast 제거 (done 상태일 때만)
    if (status === "done") {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.analysisId !== analysisId));
      }, 3 * 60 * 1000); // 3분
    }
  };

  // ✅ cancelToastStatus: 분석 중 상태를 즉시 "cancelled"로 바꿔줌
  const cancelToastStatus = (analysisId) => {
    setToasts(prev =>
      prev.map(t =>
        t.analysisId === analysisId && isProcessing(t.status)
          ? { ...t, status: "cancelled" }
          : t
      )
    );
  };

  // ✅ removeToast: 사용자가 수동으로 알림을 제거할 때 사용
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ✅ Listen for custom cancelAnalysis and viewAnalysisResult events to sync actions from file list
  useEffect(() => {
    const handleCancelAnalysis = (e) => {
      const { analysisId } = e.detail;
      cancelToastStatus(analysisId);
    };
    const handleViewAnalysisResult = (e) => {
      const { analysisId } = e.detail;
      if (analysisId) {
        console.log("[Toast Sync] Navigating to:", analysisId);
        navigate(`/analysis_results/${analysisId}`);
      }
    };
    window.addEventListener("cancelAnalysis", handleCancelAnalysis);
    window.addEventListener("viewAnalysisResult", handleViewAnalysisResult);
    return () => {
      window.removeEventListener("cancelAnalysis", handleCancelAnalysis);
      window.removeEventListener("viewAnalysisResult", handleViewAnalysisResult);
    };
  }, [navigate]);

  useEffect(() => {
    const logToastUpdate = (e) => {
      console.log("[Toast Sync] toastStatusUpdated received:", e.detail);
    };
    window.addEventListener("toastStatusUpdated", logToastUpdate);
    return () => {
      window.removeEventListener("toastStatusUpdated", logToastUpdate);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, updateProgress, updateToastStatus, cancelToastStatus }}>
      {children}
      {/* ✅ createPortal: 알림을 최상위 DOM(body)에 렌더링 */}
      {createPortal(
        <div className="fixed top-20 right-7 space-y-3 z-50">
          {toasts.map((toast) => (
            // ✅ 알림 카드: 상태에 따라 테두리와 색상 변경
            <div
              key={toast.id}
              className={`relative w-72 bg-white rounded-xl shadow-lg p-3 transition-all duration-700 ease-in-out
                ${isDone(toast.status) ? 'translate-x-0 hover:translate-x-1' : ''}
                ${isDone(toast.status) && 'animate-slide-out'}
                ${isDone(toast.status) 
                  ? 'border border-green-200' 
                  : isCancelled(toast.status) 
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
                <div className={`${isDone(toast.status) ? 'bg-green-100' : isCancelled(toast.status) ? 'bg-red-100' : 'bg-yellow-100'} p-1.5 rounded-full`}>
                  {isDone(toast.status) ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : isCancelled(toast.status) ? (
                    <ClockIcon className="h-5 w-5 text-red-500 rotate-45" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {isDone(toast.status)
                      ? "분석 완료"
                      : isCancelled(toast.status)
                      ? "분석 중지됨"
                      : "분석 중"}
                  </p>

                  <div className="text-xs text-gray-600 break-all whitespace-pre-wrap max-w-full">{toast.message}</div>

                  {/* ✅ 분석 중일 때: 프로그래스 바 표시 */}
                  {isProcessing(toast.status) && (
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
                          onClick={() => {
                            const event = new CustomEvent("cancelAnalysis", { detail: { analysisId: toast.analysisId } });
                            window.dispatchEvent(event);
                          }}
                          className="text-xs text-red-500 font-medium hover:underline"
                        >
                          분석 중지
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ✅ 분석 완료일 때: 결과 보기 링크 표시 */}
                  {isDone(toast.status) && (
                    <p
                      onClick={() => {
                        if (toast.analysisId !== null) {
                          const event = new CustomEvent("viewAnalysisResult", {
                            detail: { analysisId: toast.analysisId }
                          });
                          window.dispatchEvent(event);
                        }
                      }}
                      className="text-xs text-green-600 mt-1 font-medium cursor-pointer hover:underline"
                    >
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
{/* --- Tailwind CSS Custom Animation for Slide-Out --- */}
<style>
{`
@keyframes slide-out {
  to {
    transform: translateX(150%);
    opacity: 0;
  }
}
.animate-slide-out {
  animation: slide-out 1s ease-in forwards;
  animation-delay: 177s; /* start near 3min */
}
`}
</style>