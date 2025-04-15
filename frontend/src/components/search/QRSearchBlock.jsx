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
          className="px-4 py-2 bg-green-500 text-white rounded">
          QR 스캔 시작
        </button>
      ) : (
        <>
          <QRScanner onScanSuccess={(result) => {
            setDecodedText(result);
            setShowScanner(false);
          }} scanning={showScanner} />
          <button
            onClick={() => setShowScanner(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
            QR 스캔 취소
          </button>
        </>
      )}

      <QRUploader onDecode={handleQRResult} />
      <URLSearchForm onSearch={handleQRResult} />

      <div className="mt-4 space-y-2">
        <div className="font-medium">📦 인식된 정보:</div>
        <div className="p-2 bg-gray-200 rounded break-words">
          {decodedText || "없음"}
        </div>
        <button
          onClick={handleQRSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          분석 시작
        </button>
      </div>
    </div>
  );
}

export default QRSearchBlock;