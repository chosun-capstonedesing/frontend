import React from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

function QRUploader({ onDecode }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        try {
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromImageElement(img);
          console.log("📷 QR 분석 결과:", result.getText());
          onDecode(result.getText());
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