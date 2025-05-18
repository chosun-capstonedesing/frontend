import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../../api/auth';

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
            const res = await loginUser(form);

            if (res.success && res.data?.token) {
                alert("성공적으로 로그인되었습니다.");
                localStorage.setItem('access_token', res.data.token);
                if (onAuthSuccess) onAuthSuccess(res.data);
                navigate('/');
            } else {
                alert("아이디나 비밀번호가 올바르지 않습니다.");
                setIsSignupPrompt(false);
            }
        } catch (error) {
            const detail = error?.response?.data?.detail?.toLowerCase() || "";
            const status = error?.response?.status;
            let errMsg = "로그인 실패";

            if (status === 401) {
                if (detail.includes("비밀번호")) {
                    errMsg = "비밀번호가 올바르지 않습니다.";
                } else if (detail.includes("존재하지") || detail.includes("not found")) {
                    errMsg = "존재하지 않는 사용자입니다.";
                    setIsSignupPrompt(true);
                } else {
                    errMsg = "아이디 또는 비밀번호가 일치하지 않습니다.";
                }

                alert(errMsg);
                setMessage("");  // 클리어 메시지
                return;
            }

            // fallback for non-401 errors
            alert(errMsg);
            setMessage("");
            setIsSignupPrompt(false);
        }
    };

    const handleSignup = async () => {
        try {
            const res = await registerUser(form);

            if (res.success) {
                if (res.message?.includes("이미 가입된")) {
                    alert("이미 가입된 계정입니다. 로그인해주세요.");
                    return;
                }

                alert("회원가입 성공! 자동 로그인됩니다.");
                const loginRes = await loginUser(form);

                if (loginRes.success && loginRes.data?.token) {
                    localStorage.setItem('access_token', loginRes.data.token);
                    if (onAuthSuccess) onAuthSuccess(loginRes.data);
                    navigate('/');
                } else {
                    alert("자동 로그인 실패: 알 수 없는 응답입니다.");
                }
            } else {
                setMessage("회원가입 실패: " + res.message);
            }
        } catch (error) {
            const errMsg = error?.response?.data?.detail || error?.message || "회원가입 실패";

            if (/이미 존재|already exists|already registered/i.test(errMsg)) {
                setMessage("이미 존재하는 아이디입니다.");
                return;
            }

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
                <p className={`text-sm text-center ${
                    /회원가입 실패|로그인 실패|알 수 없는|존재하지 않|비밀번호|invalid/i.test(message)
                        ? "text-red-500"
                        : "text-gray-700"
                }`}>
                    {message}
                </p>
            )}

            <div className="text-sm text-center space-y-2 text-blue-500">
                <p>계정이 없으신가요?</p>
                <button
                    type="button"
                    onClick={handleSignup}
                    className="px-6 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
                >
                    Sign Up
                </button>
            </div>
        </form>
    );
}

export default AuthForm;