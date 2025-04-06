import React from 'react';
import { Link } from 'react-router-dom';

// 임시 파일 데이터 (추후 API로 대체 가능)
const dummyFiles = [
  { id: 1, name: 'report1.pdf', date: '2024-04-01', result: '정상' },
  { id: 2, name: 'virus_sample.hwp', date: '2024-04-02', result: '악성' },
];

export default function MyPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">내 업로드 내역</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">파일명</th>
            <th className="p-2">업로드 날짜</th>
            <th className="p-2">분석 결과</th>
            <th className="p-2">자세히</th>
          </tr>
        </thead>
        <tbody>
          {dummyFiles.map(file => (
            <tr key={file.id} className="border-t">
              <td className="p-2">{file.name}</td>
              <td className="p-2">{file.date}</td>
              <td className="p-2">{file.result}</td>
              <td className="p-2">
                <Link
                  to={`/mypage/${file.id}`}
                  className="text-blue-500 hover:underline"
                >
                  보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
