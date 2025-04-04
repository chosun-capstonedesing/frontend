import Layout from '../components/layout/Layout';
import TabNavigation from '../components/layout/TabNavigation';
import FileUpload from '../components/upload/FileUpload';
import PerformanceSection from '../components/performance/PerformanceSection';
import GuideSection from '../components/guide/GuideSection';

export default function MainLayout({
  isLoggedIn,
  uploadedFile,
  handleFileSelect,
  activeTab,
  setActiveTab
}) {
  return (
    <>
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={['analysis', 'performance', 'guide', 'mypage', 'dataset']}
      />

      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'analysis' && (
          <div className="w-full max-w-3xl min-h-[100px] mx-auto bg-white shadow-md rounded p-6">
            <h1 className="text-2xl font-bold mb-4">파일 분석</h1>
            <FileUpload onFileSelect={handleFileSelect} />
            {uploadedFile && (
              <p className="mt-2 text-green-600">파일: {uploadedFile.name}</p>
            )}
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
      </Layout>
    </>
  );
}