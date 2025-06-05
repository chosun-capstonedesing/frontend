import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import QRSearchBlock from '../../search/components/QRSearchBlock';
import GlobalStats from '../../../components/layout/GlobalStats';
import { useNavigate } from 'react-router-dom';

const syncToSessionStorage = (analysisId) => {
  const saved = localStorage.getItem(analysisId);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.name && !parsed.filename) return;  // 이름 없는 데이터는 무시

      let sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");

      const existingIndex = sessionFiles.findIndex((f) => f.analysis_id === analysisId);
      const enriched = {
        ...parsed,
        name: parsed.filename || parsed.name || "이름 없는 파일",
        status: parsed.status || "done",
        uploadedAt: parsed.uploadedAt || new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        sessionFiles[existingIndex] = { ...sessionFiles[existingIndex], ...parsed };
      } else {
        sessionFiles.push(enriched);
      }

      sessionFiles = sessionFiles.filter((f, idx, self) => 
        idx === self.findIndex((o) => o.analysis_id === f.analysis_id)
      );

      sessionStorage.setItem("uploadedFiles", JSON.stringify(sessionFiles));
    } catch (e) {
      console.error("세션 동기화 실패:", e);
    }
  }
};

const handleCancelAnalysis = (analysisId, setFileState) => {
  console.log("분석 탭에서 분석 중지 요청 수신:", analysisId);
  setFileState((prev) => {
    if (!prev || !Array.isArray(prev)) return prev;
    const updated = [...prev];
    const targetIndex = updated.findIndex((file) => file.analysis_id === analysisId);
    if (targetIndex !== -1) {
      updated[targetIndex] = {
        ...updated[targetIndex],
        status: 'cancelled',
        progress: 0,
        isUploading: false
      };
    }
    sessionStorage.setItem("uploadedFiles", JSON.stringify(updated));
    return updated;
  });
};

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  const [localUploadedFile, setLocalUploadedFile] = useState(uploadedFile);
  const [recentResults, setRecentResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalUploadedFile(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    const stored = sessionStorage.getItem("urlresult") || localStorage.getItem("urlresult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentResults(parsed.slice(0, 4));
        }
      } catch (e) {
        console.error("URL 분석 결과 로딩 실패:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleCancel = (e) => {
      const { analysisId } = e.detail;
      handleCancelAnalysis(analysisId, setLocalUploadedFile);
    };

    const handleResult = (e) => {
      const { analysisId } = e.detail;
      console.log("분석 탭에서 결과 보기 요청 수신:", analysisId);
      navigate(`/analysis_results?id=${analysisId}`);
      syncToSessionStorage(analysisId);
    };

    window.addEventListener("cancelAnalysis", handleCancel);
    window.addEventListener("viewAnalysisResult", handleResult);

    return () => {
      window.removeEventListener("cancelAnalysis", handleCancel);
      window.removeEventListener("viewAnalysisResult", handleResult);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* 파일 업로드 박스 */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">📁</span>
          <h2 className="text-lg font-semibold text-blue-600">파일 업로드</h2>
        </div>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      {/* QR / URL 검색 박스 + 분석 결과 박스 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* QR / URL 검색 박스 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full lg:w-2/3">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">🔎</span>
            <h2 className="text-lg font-semibold text-green-600">QR / URL 검색</h2>
          </div>
          <QRSearchBlock onResult={(result) => {
            if (!result?.url_info?.url || !result?.final_judgment?.final_verdict) return;

            const parsedResult = {
              id: `${result.url_info.url}-${result.analysis_metadata?.analysis_timestamp || Date.now()}`,
              url: result.url_info.url,
              resultSummary: result.final_judgment.recommendation,
              verdict: result.final_judgment.final_verdict,
              timestamp: new Date().toISOString(),
            };

            const existing = JSON.parse(sessionStorage.getItem("urlresult") || localStorage.getItem("urlresult") || "[]");
            const updatedResults = [parsedResult, ...existing.filter(r => r.id !== parsedResult.id)].slice(0, 4);
            sessionStorage.setItem("urlresult", JSON.stringify(updatedResults));
            localStorage.setItem("urlresult", JSON.stringify(updatedResults));
            setRecentResults(updatedResults);
          }} />
        </div>

        {/* QR 분석 결과 박스 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full lg:w-1/3">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-lg font-semibold text-purple-600"> QR / URL 분석 결과</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-4 text-gray-600 text-sm space-y-3">
            {recentResults.length === 0 ? (
              <div>분석 결과가 여기에 표시됩니다.</div>
            ) : (
              recentResults.map((res, idx) => (
                <div
                  key={idx}
                  className={`border-b ${idx === recentResults.length - 1 ? 'border-b-0 pb-0' : 'pb-4'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800 break-words break-all">{res.url || res.title || "분석 대상"}</div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      res.verdict === 'MALICIOUS' ? 'bg-red-100 text-red-600' :
                      res.verdict === 'SAFE' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {res.verdict === 'MALICIOUS' ? '악성' :
                       res.verdict === 'SAFE' ? '정상' : '의심'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 break-words">{res.resultSummary || "결과 없음"}</div>
                  {res.timestamp && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(res.timestamp).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                        timeZone: 'Asia/Seoul'
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
