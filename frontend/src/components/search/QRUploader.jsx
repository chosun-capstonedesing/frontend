import React, { useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { isLoggedIn } from "../../utils/isLoggedIn";

function QRUploader({ onDecode }) {
  const [qrFiles, setQrFiles] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxCount = isLoggedIn() ? Infinity : 10;

    if (qrFiles.length >= maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 QR 파일까지만 등록할 수 있습니다.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        try {
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromImageElement(img);
          console.log("📷 QR 분석 결과:", result.getText());
          onDecode(result.getText());
          setQrFiles(prev => [...prev, file]); // 파일 등록 후 리스트에 추가
        } catch (err) {
          console.warn("❌ QR 인식 실패:", err);
          alert("QR 코드를 인식하지 못했습니다.");
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}

export default QRUploader;