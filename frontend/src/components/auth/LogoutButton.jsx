import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ✅ 1. 토큰 삭제
        localStorage.removeItem('access_token');

        // ✅ 2. onLogout 콜백 실행 (로그인 상태 초기화)
        if (onLogout) onLogout();

        // ✅ 3. 메인 페이지로 이동
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="text-base hover:underline text-red-500">
            Logout
        </button>
    );
}

export default LogoutButton;