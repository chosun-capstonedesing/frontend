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
      let sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");

      const existingIndex = sessionFiles.findIndex((f) => f.analysis_id === analysisId);
      if (existingIndex !== -1) {
        sessionFiles[existingIndex] = { ...sessionFiles[existingIndex], ...parsed };
      } else {
        sessionFiles.push(parsed);
      }

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
    return updated;
  });
};

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  const [localUploadedFile, setLocalUploadedFile] = useState(uploadedFile);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalUploadedFile(uploadedFile);
  }, [uploadedFile]);

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
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">📁</span>
          <h2 className="text-lg font-semibold text-blue-600">파일 업로드</h2>
        </div>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      {/* QR / URL 검색 박스 */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🔎</span>
          <h2 className="text-lg font-semibold text-green-600">QR / URL 검색</h2>
        </div>
        <QRSearchBlock />
      </div>
    </div>
  );
}
