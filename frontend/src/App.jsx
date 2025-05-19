import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './features/auth/pages/LoginPage';
import MainLayout from './routes/MainLayout';
import LogoutButton from './features/auth/components/LogoutButton';
import MyPage from './features/mypage/pages/MyPage';
import MyPageDetail from './features/mypage/pages/MyPageDetail';
import GuideSection from './features/guide/pages/GuideSection';
import PerformanceSection from './features/performance/pages/PerformanceSection';
import AnalysisPage from './features/analysis/pages/AnalysisPage';
import { isLoggedIn as checkLoginStatus } from './utils/isLoggedIn';
import { ToastProvider } from './context/ToastContext';
import AnalysisResults from './features/analysis/pages/AnalysisResults';
import { v4 as uuidv4 } from 'uuid';

function App() {
  if (!Cookies.get('client_uuid')) {
    Cookies.set('client_uuid', uuidv4(), { expires: 1, path: '/' }); // 1일 유지
  }

  const isDev = import.meta.env.DEV;
  const [isLoggedIn, setIsLoggedIn] = useState(isDev ? true : checkLoginStatus());

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
      <div className="min-h-screen bg-gray-100 p-5 overflow-hidden">
        <div className="flex justify-end space-x-4 mb-2 mr-5">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="text-base hover:underline">My Page</Link>
              <LogoutButton onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="text-base hover:underline">Login/SignUp</Link>
            </>
          )}
        </div>

        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AnalysisPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="analysis_results/:analysis_id" element={<AnalysisResults />} />
            <Route path="performance" element={<PerformanceSection />} />
            <Route path="guide" element={<GuideSection />} />
            <Route path="mypage/detail/:analysis_id" element={<MyPageDetail />} />
          </Route>
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;