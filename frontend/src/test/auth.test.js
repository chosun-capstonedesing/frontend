import { loginUser, registerUser } from '../api/auth';

export default async function runAuthTests() {
  console.log('🚀 Auth 테스트 시작');

  const testUser = { username: 'testuser', password: '1234' };

  try {
    console.log('📝 회원가입 시도 중...');
    const signup = await registerUser(testUser);
    console.log('✅ 회원가입 결과:', signup);
  } catch (err) {
    console.error('❌ 회원가입 에러:', err);
  }

  try {
    console.log('🔑 로그인 시도 중...');
    const login = await loginUser(testUser);
    console.log('✅ 로그인 결과:', login);

    if (login.success && login.data?.token) {
      localStorage.setItem('access_token', login.data.token);
      console.log('🔐 토큰 저장 완료!');
    } else {
      console.warn('⚠️ 로그인 성공했지만 토큰이 없음');
    }
  } catch (err) {
    console.error('❌ 로그인 에러:', err);
  }

  console.log('🏁 Auth 테스트 종료');
}