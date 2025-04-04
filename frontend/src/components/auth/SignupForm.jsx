import React, { useState } from 'react';

function SignupForm() {
    // 살려주세요 이렇게 일이 많을 줄이야 이번주 프론트 쉬라면서.. 개발 고생했다고 쉬라고 했자나요...
    const [form, setForm] = useState({ username: '', password: ''});

    const handleChange = e => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = e => {
        e.preventDefault();
        //TODO: 회원가입 요청 API 연결
        console.log('회원가입 정보: ', form);
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

            <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded'>SignUp</button>
        </form>
    );
}

export default SignupForm;