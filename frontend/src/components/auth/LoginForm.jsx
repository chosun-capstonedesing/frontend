import React, { useState } from 'react';

/**
 * 로그인 폼 제작
 * 아이디/비밀번호 입력 + 로그인 처리
 * 
 * - ID, PW 입력창 제작
 * - Login 버튼 생성
 */

function LoginFrom() {
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // TODO: 로그인 요청 API 연결
        console.log('로그인 정보:', form);
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

export default LoginFrom;