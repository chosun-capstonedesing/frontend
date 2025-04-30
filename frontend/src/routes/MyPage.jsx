import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: API 연동 시 이 부분 제거하고 fetch로 대체
const dummyFiles = [
  { id: 1, name: 'report1.pdf', date: '2024-04-01', result: '정상', pdfUrl: '/pdfs/report1.pdf', resultUrl: '/results/report1.json' },
  { id: 2, name: 'virus_sample.hwp', date: '2024-04-02', result: '악성', pdfUrl: '/pdfs/virus_sample.pdf', resultUrl: '/results/virus_sample.json' },
  { id: 3, name: 'virus_sample2.exe', date: '2025-05-01', result: '악성', pdfUrl: '/pdfs/virus_sample2.pdf', resultUrl: '/results/virus_sample2.json' },
];

export default function MyPage() {
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('전체');
  const [sortOption, setSortOption] = useState('최신순');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 추후 API 호출로 대체 가능
    setFileList(dummyFiles);
  }, []);

  const filteredFiles = fileList.filter(file => {
    if (activeTab === '전체') return true;
    return file.result === activeTab;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOption === '최신순' ? dateB - dateA : dateA - dateB;
  });

  const visibleFiles = sortedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

return (
  <div className="bg-white min-h-screen py-8 px-8 rounded-x">
      <h2 className="text-3xl font-bold mb-4">내 업로드 내역</h2>

      {/* 탭 메뉴 및 검색바 */}
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4 border-b border-gray-200 pb-2">
        <div className="flex space-x-6">
          {['전체', '정상', '악성'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-400'
              }`}
            >
              {tab === '전체' ? '전체' : `${tab}파일`}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="파일명 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-4 w-28">
        <label htmlFor="sort" className="block text-sm font-medium text-gray-600 mb-1">정렬 순서</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="block w-full px-2 py-1 text-sm text-gray-700 border border-gray-300 bg-white rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="최신순">최신순</option>
          <option value="오래된순">오래된 순</option>
        </select>
      </div>

      <ul className="bg-white rounded-lg shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] divide-y divide-gray-200">
          {visibleFiles.map(file => (
          <li
            key={file.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-md cursor-default"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  file.result === '정상' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg className={`h-5 w-5 ${
                    file.result === '정상' ? 'text-green-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                      file.result === '정상'
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M6 18L18 6M6 6l12 12'
                    } />
                  </svg>
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{file.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
                file.result === '정상' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {file.result}
              </span>
              <Link to={`/mypage/${file.id}`} className="text-sm text-blue-500 hover:underline">보기</Link>
              <a href={file.pdfUrl} download className="text-sm text-purple-600 hover:underline">PDF</a>
            </div>
          </li>
          ))}
      </ul>
  </div>
);
}
