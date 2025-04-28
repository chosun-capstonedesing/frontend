import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* 로그인/회원가입 폼 통합
- 로그인 중 계정이 없을 경우, 회원가입 버튼 활성화 -> 바로 회원가입 가능
- ✅ 로그인/회원가입 성공 시 토큰을 localStorage에 저장하도록 추가
*/

function AuthForm({ onAuthSuccess }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [isSignupPrompt, setIsSignupPrompt] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth', form);
            setMessage(res.data.message);

            if (res.data.message.includes("성공")) {
                // ✅ 로그인 성공 시 토큰 저장
                // 👉 [주의] 나중에 백엔드가 token 키 이름을 다르게 줄 수도 있음
                // 예시: res.data.token, res.data.access_token 등
                if (res.data.token) { 
                    localStorage.setItem('access_token', res.data.token);
                }
                if (onAuthSuccess) onAuthSuccess(res.data);
                navigate('/');
            }
        } catch (err) {
            setMessage(err.response?.data?.detail || '계정이 없거나 찾을 수 없습니다.');
            setIsSignupPrompt(true);
        }
    };

    const handleSignup = async () => {
        try {
            const res = await axios.post('/auth', form);
            setMessage("회원가입 성공! 자동 로그인됩니다.");

            // ✅ 회원가입 성공 시 토큰 저장
            // 👉 [주의] 백엔드 응답 구조에 따라 token 키 확인 필요
            if (res.data.token) {
                localStorage.setItem('access_token', res.data.token);
            }
            if (onAuthSuccess) onAuthSuccess(res.data);
            navigate('/');
        } catch (err) {
            setMessage("회원가입 실패: " + (err.response?.data?.detail || '오류'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
            <input
                name="username"
                placeholder="ID"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />

            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold">
                Sign In
            </button>

            {message && (
                <p className={`text-sm text-center ${message.includes("계정이 없거나") ? "text-red-500" : "text-gray-700"}`}>
                    {message}
                </p>
            )}

            {isSignupPrompt && (
                <div className="text-sm text-center space-y-2 text-blue-500 animate-[pulse_3s_ease-in-out_infinite]">
                    <p>회원가입 하시겠습니까?</p>

                    <button
                        type="button"
                        onClick={handleSignup}
                        className="px-6 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold">
                        Sign Up
                    </button>
                </div>
            )}
        </form>
    );
}

export default AuthForm;