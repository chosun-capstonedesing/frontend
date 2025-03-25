import React, { useState } from 'react'
import FileUpload from './components/FileUpload';
import TabNavigation from './components/TabNavigation';

function App() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [uploadedFile, setUploadedFile] = useState(null);

  // 파일 선택 시 콜백
  const handleFileSelect = (file) => {
    console.log('선택된 파일: ', file);
    setUploadedFile(file);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'analysis' && (
        <div className="max-w-md max-auto bg-white shadow-md rounded p-6">
          <h1 className='text-xl font-bold mb-4'>파일 분석</h1>
          <FileUpload onFileSelect={handleFileSelect} />
          {uploadedFile && (
            <p className='mt-2 text-green-600'>
              파일: {uploadedFile.naame}
            </p>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className='mt-4'>
          <PerformanceSection />
          </div>
      )}

      {activeTab === 'guide' && (
        <div className='mt-4'>
          <GuideSection/>
          </div>
      )}
    </div>
  );
}
export default App;
