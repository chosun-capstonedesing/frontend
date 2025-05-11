import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../api/auth';

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
            const data = await loginUser(form);
            setMessage("로그인 성공");

            if (data.token) {
                localStorage.setItem('access_token', data.token);
            }
            if (onAuthSuccess) onAuthSuccess(data);
            navigate('/');
        } catch (errMsg) {
            setMessage(errMsg);
            setIsSignupPrompt(true);
        }
    };

    const handleSignup = async () => {
        try {
            const data = await registerUser(form);
            setMessage("회원가입 성공! 자동 로그인됩니다.");

            if (data.token) {
                localStorage.setItem('access_token', data.token);
            }
            if (onAuthSuccess) onAuthSuccess(data);
            navigate('/');
        } catch (errMsg) {
            setMessage("회원가입 실패: " + errMsg);
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