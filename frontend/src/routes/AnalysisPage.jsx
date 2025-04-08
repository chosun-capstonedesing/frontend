import React from 'react';
import FileUpload from '../components/upload/FileUpload';
import QRSearchBlock from '../components/search/QRSearchBlock';

export default function AnalysisPage({ uploadedFile, handleFileSelect }) {
  return (
    <div className="w-full sm:max-w-3xl md:max-w-6xl lg:max-w-7xl xl:max-w-8xl mx-auto bg-white shadow-md rounded p-5 sm:p-7 md:p-9 transition-all duration-400">
      <h1 className="text-2xl font-bold mb-4">파일 분석</h1>
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
