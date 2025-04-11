import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import MainLayout from './routes/MainLayout';
import LogoutButton from './components/auth/LogoutButton';
import MyPage from './routes/Mypage';
import GuideSection from './routes/GuideSection';
import PerformanceSection from './routes/PerformanceSection';
import AnalysisPage from './routes/AnalysisPage';

function App() {
  // 사용자 로그인 상태 설정 코드
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-3 overflow-hidden">
        <div className="flex justify-end space-x-4 mb-4">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="text-sm hover:underline">My Page</Link>
              <LogoutButton onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">Login/SignUp</Link>
            </>
          )}
        </div>

        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AnalysisPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="performance" element={<PerformanceSection />} />
            <Route path="guide" element={<GuideSection />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;