import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import MyPage from './features/mypage/pages/MyPage';
import MyPageDetail from './features/mypage/pages/MyPageDetail';
import GuideSection from './features/guide/pages/GuideSection';
import PerformanceSection from './features/performance/pages/PerformanceSection';
import AnalysisPage from './features/analysis/pages/AnalysisPage';
import { ToastProvider } from './context/ToastContext';
import AnalysisResults from './features/analysis/pages/AnalysisResults';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const location = useLocation();
  const showLoginModal = location.pathname === '/login';

  if (!Cookies.get('client_uuid')) {
    Cookies.set('client_uuid', uuidv4(), { expires: 1, path: '/' }); // 1일 유지
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isValidToken = (token) => {
    return token && token !== "undefined" && token.trim() !== "";
  };

  useEffect(() => {
    const clientUuid = Cookies.get('client_uuid');
    if (clientUuid && chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: "SET_CLIENT_UUID",
        uuid: clientUuid,
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(isValidToken(token));
  }, []);

  const handleLoginSuccess = (accessToken) => {
    localStorage.setItem('access_token', accessToken); // 로그인 성공 시 토큰 저장
    sessionStorage.removeItem('uploadedFiles');               // ✅ 업로드 기록 삭제
    sessionStorage.removeItem('uploadedCount');               // ✅ 업로드 개수 삭제
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 로그아웃 시 토큰 삭제
    setIsLoggedIn(false);
  };

  return (
    <ToastProvider>
      <div className="max-h-screen">
        {showLoginModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md backdrop-brightness-50">
            <div className="p-6 w-[90%] max-w-md">
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>,
          document.body
        )}
        <Routes>
          {/* <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} /> */}
          <Route path="/" element={<MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
            <Route index element={<AnalysisPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="analysis_results/:analysis_id" element={<AnalysisResults />} />
            <Route path="analysis_results" element={<AnalysisResults />} />
            <Route path="performance/:analysis_id" element={<PerformanceSection />} />
            <Route path="performance" element={<PerformanceSection />} />
            <Route path="guide" element={<GuideSection />} />
            <Route path="mypage/detail/:analysis_id" element={<MyPageDetail />} />
            {/* <Route path="qr_url_search" element={<QRandURLPage />} /> */}
          </Route>
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;