import React from 'react';
import FileUpload from '../components/upload/FileUpload';
import QRSearchBlock from '../components/search/QRSearchBlock';
import GlobalStats from '../components/layout/GlobalStats';

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  return (
    <div className=" bg-white shadow-md rounded p-6">
      <GlobalStats/>
      <h1 className="text-2xl font-bold mb-4">🗂️ 파일 분석</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      {uploadedFile && (
        <p className="mt-2 text-green-600">파일: {uploadedFile.name}</p>
      )}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">🔍 QR / URL 검색</h2>
        <QRSearchBlock />
      </div>
    </div>
  );
}
