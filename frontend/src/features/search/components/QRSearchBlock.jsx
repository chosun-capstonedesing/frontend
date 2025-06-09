import React, { useState } from 'react';
import QRScanner from './QRScanner';
import QRUploader from './QRUploader';
import URLSearchForm from './URLSearchForm';

const API_BASE= import.meta.env.VITE_API_BASE;

function QRSearchBlock({ onResult }) {
  const [decodedText, setDecodedText] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleQRResult = (result) => {
    setDecodedText(result);
  };

  const handleQRSearch = async () => {
    if (!decodedText) {
      alert("QR 또는 URL 정보를 먼저 입력해주세요.");
      return;
    }
    try {
      console.log("🔗 분석 요청 URL:", decodedText);
      console.log("📡 요청 주소:", `${API_BASE}/url/analyze`);
      const response = await fetch(`${API_BASE}/url/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: decodedText })
      });

      const result = await response.json();

      if (!response.ok) {
        alert("분석 중 오류 발생: " + (result.message || "알 수 없는 오류"));
        return;
      }

      console.log("🔍 분석 결과:", result);
      alert(`분석 완료! 위험도: ${result.final_judgment.final_verdict}\n추천: ${result.final_judgment.recommendation}`);

      const parsedResult = {
        id: `${result.url_info.url}-${Date.now()}`, // Use consistent and unique ID
        url: result.url_info.url,
        resultSummary: result.final_judgment.recommendation,
        verdict: result.final_judgment.final_verdict,
        timestamp: result.analysis_metadata?.analysis_timestamp || new Date().toISOString(),
      };

      const existing = JSON.parse(sessionStorage.getItem("urlresult") || localStorage.getItem("urlresult") || "[]");
      const updatedResults = [parsedResult, ...existing.filter(r => r.id !== parsedResult.id)].slice(0, 4);
      sessionStorage.setItem("urlresult", JSON.stringify(updatedResults));
      localStorage.setItem("urlresult", JSON.stringify(updatedResults));

      // Ensure both result update and UI re-render
      if (onResult) {
        onResult(parsedResult);
      }
      window.dispatchEvent(new Event("urlResultUpdated"));
      setDecodedText('');
    } catch (error) {
      console.error("분석 요청 실패:", error);
      alert("분석 요청 중 네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {!showScanner ? (
        <button
          onClick={() => setShowScanner(true)}
          className="px-4 py-2 rounded-2xl shadow-xl bg-green-500 hover:bg-green-600 text-white">
          QR 스캔 시작
        </button>
      ) : (
        <div className="relative">
          <QRScanner onScanSuccess={(result) => {
            setDecodedText(result);
            setShowScanner(false);
          }} scanning={showScanner} />
          <button
            onClick={() => setShowScanner(false)}
            className="absolute bottom-2 right-2 px-4 py-2 rounded-2xl shadow-xl bg-red-500 hover:bg-red-600 text-white">
            QR 스캔 취소
          </button>
        </div>
      )}

      <QRUploader onDecode={handleQRResult} />
      <URLSearchForm onSearch={handleQRResult} />

      <div className="mt-4 space-y-5">
        <div className="font-medium">📦 인식된 정보:</div>
        <div className="p-3 pl-5 bg-gray-200 rounded-2xl shadow-xl break-words">
          {decodedText || "없음"}
        </div>
        <button
          onClick={handleQRSearch}
          className="mt-5 px-5 py-2 rounded-2xl shadow-xl bg-blue-500 text-white hover:bg-blue-600">
          분석 시작
        </button>
      </div>
    </div>
  );
}

export default QRSearchBlock;