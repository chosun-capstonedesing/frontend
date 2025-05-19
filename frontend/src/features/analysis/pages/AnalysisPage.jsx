import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import QRSearchBlock from '../../search/components/QRSearchBlock';
import GlobalStats from '../../../components/layout/GlobalStats';
import { useNavigate } from 'react-router-dom';

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  const [localUploadedFile, setLocalUploadedFile] = useState(uploadedFile);
  const [activeTab, setActiveTab] = useState('upload');
  const navigate = useNavigate();

  useEffect(() => {
    setLocalUploadedFile(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    const handleCancel = (e) => {
      const { analysisId } = e.detail;
      console.log("분석 탭에서 분석 중지 요청 수신:", analysisId);
      // 상태 업데이트로 재분석 버튼이 보이도록 구성 (예: 파일 상태를 'cancelled'로 변경)
      setLocalUploadedFile((prev) => {
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

    const handleResult = (e) => {
      const { analysisId } = e.detail;
      console.log("분석 탭에서 결과 보기 요청 수신:", analysisId);
      navigate(`/analysis_results?id=${analysisId}`);
    };

    window.addEventListener("cancelAnalysis", handleCancel);
    window.addEventListener("viewAnalysisResult", handleResult);

    return () => {
      window.removeEventListener("cancelAnalysis", handleCancel);
      window.removeEventListener("viewAnalysisResult", handleResult);
    };
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-6">
      <GlobalStats />
      <h1 className="text-2xl font-semibold mb-4">🗂️ 파일 분석</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('upload')}
          >
            파일 업로드
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'search'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('search')}
          >
            QR / URL 검색
          </button>
        </nav>
      </div>

      {activeTab === 'upload' && (
        <>
          <FileUpload onFileSelect={handleFileSelect} />
        </>
      )}

      {activeTab === 'search' && (
        <div>
          <QRSearchBlock />
        </div>
      )}
    </div>
  );
}
