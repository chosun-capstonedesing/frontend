import React from 'react';
import { useParams, Link } from 'react-router-dom';

// 📌 실제 환경에서는 아래 데이터를 API 호출로 받아와야함.
const dummyDetails = {
  1: {
    name: 'report1.pdf',
    date: '2024-04-01',
    result: '정상',
    details: '해당 파일은 이상이 없는 것으로 분석되었습니다.'
  },
  2: {
    name: 'virus_sample.hwp',
    date: '2024-04-02',
    result: '악성',
    details: '악성 코드로 의심되는 스크립트가 포함되어 있습니다.'
  }
};

export default function MyPageDetail() {
  const { fileId } = useParams();
  const fileData = dummyDetails[fileId];

  if (!fileData) {
    return <div className="p-6 text-red-500">해당 파일의 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <Link to="/mypage" className="text-blue-500 hover:underline">← 내 파일 목록으로</Link>
      <h2 className="text-2xl font-bold mt-4 mb-4">파일 분석 결과</h2>

      <ul className="space-y-2">
        <li><strong>파일명:</strong> {fileData.name}</li>
        <li><strong>업로드 날짜:</strong> {fileData.date}</li>
        <li><strong>분석 결과:</strong> <span className={fileData.result === '악성' ? 'text-red-500' : 'text-green-600'}>{fileData.result}</span></li>
        <li><strong>분석 내용:</strong> {fileData.details}</li>
      </ul>
    </div>
  );
}