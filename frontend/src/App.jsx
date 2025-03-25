import React, { useState } from 'react'
import FileUpload from './components/FileUpload';
import { NULL } from 'mysql/lib/protocol/constants/types';

function App() {
  const [activeTab, setActiveTab] = useState('analyusis');
  const [uploadedFile, setUploadedFile] = useState(null);

  // 파일 선택 시 콜백
  const handleFileSelect = (file) => {
    console.log('선택된 파일: ', file);
    setUploadedFile(file);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'analysis' && (
        <div>
          <h1 className='text-2xl font-bold mb-4'>파일 분석</h1>
          <p className='mb-4 text-gray-600'>
            실행 파일(.exe, .dll 등)을 업로드하여 악성 여부를 분석합니다.
          </p>
          <FileUpload onFileSelect={(file) => console.log('선택된 파일: ', file)}/>
        </div>
      )}
    </Layout>
  )
}
export default App;
