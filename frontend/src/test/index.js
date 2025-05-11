import runAuthTests from './auth.test.js';
import { runRemainingTest } from './remaining.test.js';
import { runAnalyzeFullTest } from './analyzeFull.test.js';

console.log('🧪 테스트 진입: index.js 실행됨');

runAuthTests().then(() => {
  console.log('✅ Auth 테스트 완료');
}).catch((err) => {
  console.error('❌ Auth 테스트 중 오류 발생:', err);
});

runRemainingTest().then(() => {
  console.log('✅ 업로드 제한 테스트 완료');
}).catch((err) => {
  console.error('❌ 업로드 제한 테스트 중 오류 발생:', err);
});

runAnalyzeFullTest().then(() => {
  console.log('✅ 분석 요청 테스트 완료');
}).catch((err) => {
  console.error('❌ 분석 요청 테스트 중 오류 발생:', err);
});