import React, { useState } from 'react'
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import PerformanceSection from './components/PerformanceSection';
import GuideSection from './components/GuideSection';
import TabNavigation from './components/TabNavigation';


function App() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = (file) => {
    console.log('선택된 파일: ', file);
    setUploadedFile(file);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-3 overflow-hidd'>

      {/* 탭 전환 UI */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 사이드바 레이아웃 컴포넌트 */}
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'analysis' && (
          <div className="w-full max-w-3x1 min-h-[100px] mx-auto bg-white shadow-md rounded p-6">
            <h1 className='text-2xl font-bold mb-4'>파일 분석</h1>
            <FileUpload onFileSelect={handleFileSelect} />
            {uploadedFile && (
              <p className='mt-2 text-green-600'>
                파일: {uploadedFile.name}
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
            <GuideSection />
          </div>
        )}
      </Layout>
    </div>
  );
}

export default App;