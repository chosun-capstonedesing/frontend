import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, status = "done", fileIndex = null, progress = 0) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, status, fileIndex, progress }]);
  };

  const updateProgress = (fileIndex, progress) => {
    setToasts(prev =>
      prev.map(t =>
        t.fileIndex === fileIndex && t.status === "processing"
          ? { ...t, progress }
          : t
      )
    );
  };

  const updateToastStatus = (fileIndex, status = "done") => {
    setToasts(prev =>
      prev.map(t =>
        t.fileIndex === fileIndex && t.status === "processing"
          ? { ...t, status, progress: 100 }
          : t
      )
    );
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, updateProgress, updateToastStatus }}>
      {children}
      {createPortal(
        <div className="fixed top-5 right-5 space-y-3 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`relative w-72 bg-white shadow-md rounded-md p-3 
                ${toast.status === 'done' ? 'border border-green-200' : 'border border-yellow-300'}`}
            >
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
                <div className={`${toast.status === 'done' ? 'bg-green-100' : 'bg-yellow-100'} p-1.5 rounded-full`}>
                  {toast.status === "done" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {toast.status === "done" ? "분석 완료" : "분석 중"}
                  </p>

                  <div className="text-xs text-gray-600">{toast.message}</div>

                  {toast.status === "processing" && (
                    <div className="w-full mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 bg-yellow-400 rounded-full transition-all duration-200"
                            style={{ width: `${toast.progress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">{toast.progress || 0}%</div>
                      </div>
                    </div>
                  )}

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