import React, { useState } from 'react';
import QRScanner from './QRScanner';
import QRUploader from './QRUploader';
import URLSearchForm from './URLSearchForm';

function QRSearchBlock() {
  const [decodedText, setDecodedText] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleQRResult = (result) => {
    setDecodedText(result);
  };

  const handleQRSearch = () => {
    if (!decodedText) {
      alert("QR 또는 URL 정보를 먼저 입력해주세요.");
      return;
    }
    console.log("🔍 분석 시작:", decodedText);
    // TODO: 여기에 분석 로직 추가
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