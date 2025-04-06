import Layout from '../components/layout/Layout';
import TabNavigation from '../components/layout/TabNavigation';
import FileUpload from '../components/upload/FileUpload';
import PerformanceSection from '../components/performance/PerformanceSection';
import GuideSection from '../components/guide/GuideSection';
import QRSearchPage from './QRSearchPage';
import QRScanner from '../components/search/QRScanner';
import QRUploader from '../components/search/QRUploader';
import URLSearchForm from '../components/search/URLSearchForm';
import QRSearchBlock from '../components/search/QRSearchBlock';
import { useState } from 'react';

export default function MainLayout({
  isLoggedIn,
  uploadedFile,
  handleFileSelect,
  activeTab,
  setActiveTab
}) {
  const [decodedText, setDecodedText] = useState('');

  const handleQRResult = (result) => {
    setDecodedText(result);
  };

  const handleQRSearch = () => {
    if (!decodedText) {
      alert("QR 또는 URL 정보를 먼저 입력해주세요.");
      return;
    }
    console.log("🔍 QR 분석 시작:", decodedText);
    // 분석 또는 이동 로직 추가 가능
  };

  return (
    <>
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={['analysis', 'performance', 'guide', 'mypage', 'dataset', 'qr']}
      />

      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'analysis' && (
          <div className="w-full max-w-3xl min-h-[100px] mx-auto bg-white shadow-md rounded p-6">
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
        )}

        {activeTab === 'performance' && (
          <div className="mt-4">
            <PerformanceSection />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="mt-4">
            <GuideSection />
          </div>
        )}

        {activeTab === 'mypage' && (
          <div className="mt-4">
            {isLoggedIn ? (
              <p className="text-lg font-semibold">My Page</p>
            ) : (
              <p className="text-red-500 text-lg font-semibold">로그인 후 이용해주세요.</p>
            )}
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="mt-4">
            {isLoggedIn ? (
              <p className="text-lg font-semibold">Dataset Page</p>
            ) : (
              <p className="text-red-500 text-lg font-semibold">로그인 후 이용해주세요.</p>
            )}
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="mt-4">
            <QRSearchPage />
          </div>
        )}
      </Layout>
    </>
  );
}