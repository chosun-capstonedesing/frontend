import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
import MainLayout from './routes/MainLayout';
import LogoutButton from './components/auth/LogoutButton';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const handleFileSelect = (file) => setUploadedFile(file);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-3 overflow-hidden">
        <div className="flex justify-end space-x-4 mb-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm hover:underline">Login</Link>
              <Link to="/signup" className="text-sm hover:underline">SignUp</Link>
            </>
          ) : (
            <LogoutButton onLogout={handleLogout} />
          )}
        </div>

        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupPage onSignupSuccess={handleLoginSuccess} />} />
          <Route
            path="*"
            element={
              <MainLayout
                isLoggedIn={isLoggedIn}
                uploadedFile={uploadedFile}
                handleFileSelect={handleFileSelect}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;