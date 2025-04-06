import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 로그인 폼 제작
 * 아이디/비밀번호 입력 + 로그인 처리
 * 
 * - ID, PW 입력창 제작
 * - Login 버튼 생성
 */

function LoginForm({ onLoginSucces }) {
    const [form, setForm] = useState({ username: '', password: '' });

    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // TODO: 로그인 로직 및 API 연결
        console.log('로그인 정보:', form);

        // 로그인 성공 시
        if (onLoginSucces) onLoginSucces();
        navigate('/');
    };



    return (
        <form onSubmit={handleSubmit} className='space-y-2 p-4 border rounded'>
            <input
                name='username'
                placeholder='ID'
                value={form.username}
                onChange={handleChange}
                className='w-full p-2 border rounded'
                required
            />

            <input
                name='password'
                type='password'
                placeholder='PW'
                value={form.password}
                onChange={handleChange}
                className='w-full p-2 border rounded'
                required
            />

            <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded'>Login</button>
        </form>
    );
}

export default LoginForm;