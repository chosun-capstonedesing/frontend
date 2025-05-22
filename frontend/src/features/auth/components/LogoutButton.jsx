import { FaUser } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, deleteCookie } from "../../../utils/cookie";

function LogoutButton({ onLogout, userId }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm("로그아웃 하시겠습니까?");
        if (!confirmed) return;

        // ✅ 1. 토큰 삭제
        localStorage.removeItem('access_token');
        deleteCookie('user_id');

        // ✅ 2. onLogout 콜백 실행 (로그인 상태 초기화)
        if (onLogout) onLogout();

        // ✅ 3. 메인 페이지로 이동
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="text-base hover:underline text-gray-700 inline-flex items-center gap-2">
            <FaUser className="text-gray-600" />
            {userId ? `Welcome, ${userId}` : "Welcome"}
        </button>
    );
}

export default LogoutButton;