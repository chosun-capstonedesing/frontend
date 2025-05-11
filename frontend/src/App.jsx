import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import MainLayout from './routes/MainLayout';
import LogoutButton from './components/auth/LogoutButton';
import MyPage from './routes/MyPage';
import MyPageDetail from './routes/MyPageDetail';
import GuideSection from './routes/GuideSection';
import PerformanceSection from './routes/PerformanceSection';
import AnalysisPage from './routes/AnalysisPage';
import { isLoggedIn as checkLoginStatus } from './utils/isLoggedIn';
import { ToastProvider } from './context/ToastContext';
import AnalysisResults from './routes/AnalysisResults';
import { v4 as uuidv4 } from 'uuid';

function App() {
  useEffect(() => {
    if (!document.cookie.includes("client_uuid")) {
      document.cookie = `client_uuid=${uuidv4()}; path=/; max-age=86400`;  // 1일 유지
    }
  }, []);

  const isDev = import.meta.env.DEV;
  const [isLoggedIn, setIsLoggedIn] = useState(isDev ? true : checkLoginStatus());

  const handleLoginSuccess = () => {
    localStorage.setItem('access_token', 'mock_token_value'); // 로그인 성공 시 토큰 저장
    sessionStorage.removeItem('uploadedFiles');               // ✅ 업로드 기록 삭제
    sessionStorage.removeItem('uploadedCount');               // ✅ 업로드 개수 삭제
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 로그아웃 시 토큰 삭제
    setIsLoggedIn(false);
  };

  return (
    <Router>
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
              <Route path="analysis_results" element={<AnalysisResults />} />
              <Route path="performance" element={<PerformanceSection />} />
              <Route path="guide" element={<GuideSection />} />
              <Route path="mypage/detail/:id" element={<MyPageDetail />} />
            </Route>
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;