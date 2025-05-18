import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import QRSearchBlock from '../../search/components/QRSearchBlock';
import GlobalStats from '../../../components/layout/GlobalStats';

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  const [localUploadedFile, setLocalUploadedFile] = useState(uploadedFile);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    setLocalUploadedFile(uploadedFile);
  }, [uploadedFile]);

  const renderFileAnalysisSummary = () => {
    if (!localUploadedFile) return null;
    // Example: simple analysis summary with file name and dummy malicious status
    const isMalicious = localUploadedFile.name.toLowerCase().includes('malware') ? 'Yes' : 'No';
    return (
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">파일 분석 요약</h3>
        <p><strong>파일명:</strong> {localUploadedFile.name}</p>
        <p><strong>악성 여부:</strong> {isMalicious}</p>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <GlobalStats />
      <h1 className="text-2xl font-semibold mb-4">🗂️ 파일 분석</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            파일 업로드
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
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
          {renderFileAnalysisSummary()}
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
