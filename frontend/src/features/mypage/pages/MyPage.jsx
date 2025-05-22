import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FileAccordionDetail from './MyPageDetail';
import ReactPaginate from 'react-paginate';
import { getUploadedFilesFromSession, deleteFileFromSessionAndLocal } from '../../analysis/components/useUploadSession';

export default function MyPage() {
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('전체');
  const [sortOption, setSortOption] = useState('최신순');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    const sessionFiles = getUploadedFilesFromSession();
    const combinedMap = new Map();

    [...savedFiles, ...sessionFiles].forEach((file, i) => {
      const analysis_id = file.analysis_id || file.sha256 || `${file.name}-${file.date || i}`;
      // --- BEGIN PATCHED RESULT LOGIC ---
      let result = '정보 없음';
      const hasLog = file.log && Object.keys(file.log).length > 0;
      const hasId = !!(file.analysis_id || file.sha256 || file.name);
      const hasResult = typeof file.result === 'string' && file.result !== '정보 없음';

      if (hasLog || hasId) {
        const mal = Number(
          file.malicious ??
          file.performance?.['Malware Accuracy'] ??
          file.log?.malicious ??
          (file.result === '악성' ? 1 : file.result === '정상' ? 0 : undefined)
        );
        if (!isNaN(mal)) {
          result = mal >= 0.6 ? '악성' : '정상';
        } else if (hasResult) {
          if (['악성', '정상', '의심'].includes(file.result)) {
            result = file.result;
          } else {
            result = '분석 완료';
          }
        } else if (hasLog || file.log !== undefined) {
          result = '분석 완료';
        }
      }
      // --- END PATCHED RESULT LOGIC ---
      combinedMap.set(analysis_id, {
        ...file,
        analysis_id,
        result,
        sha256: file.sha256 ?? file.hash,
        summary: file.summary ?? file.description ?? file.result_summary ?? null,
        report_url: file.report_url ?? file.pdfUrl ?? file.reportURL ?? null,
        pdfUrl: file.report_url ?? file.pdfUrl,
        name: file.name ?? file.filename ?? '',
      });
    });

    setFileList(Array.from(combinedMap.values()));
  }, []);

  const getFilteredAndSortedFiles = () => {
    return [...fileList]
      .filter(file => activeTab === '전체' || file.result === activeTab)
      .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.log?.start_time || a.date || a.uploadedAt || 0);
        const dateB = new Date(b.log?.start_time || b.date || b.uploadedAt || 0);
        if (isNaN(dateA) || isNaN(dateB)) return 0;
        return sortOption === '최신순' ? dateB - dateA : dateA - dateB;
      });
  };

  const visibleFiles = getFilteredAndSortedFiles();
  const sortedAndPaginatedFiles = visibleFiles.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const pageCount = Math.max(1, Math.ceil(visibleFiles.length / itemsPerPage));
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 파일 삭제 핸들러
  const handleDelete = (id) => {
    deleteFileFromSessionAndLocal(id);
    const updated = fileList.filter(file => file.analysis_id !== id);
    setFileList(updated);
    window.dispatchEvent(new Event("fileListUpdated"));
  };

  return (
    <div className="bg-white py-8 px-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-4">내 업로드 내역</h2>

      {/* 탭 메뉴 및 검색바 */}
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4 border-b border-gray-200 pb-2">
        <div className="flex space-x-6">
          {['전체', '분석중', '정상', '악성'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 ${activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-400'
                }`}
            >
              {tab === '전체' ? '전체' : `${tab} 파일`}
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
        {sortedAndPaginatedFiles.map(file => (
          <li
            key={file.analysis_id}
            className="group relative p-4 flex flex-col hover:bg-gray-50 transition-colors duration-200 rounded-md cursor-default"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDelete(file.analysis_id)}
                  className="absolute -top-1.5 -left-1.5 bg-gray-400 hover:bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="파일 삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex-shrink-0">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    file.result === '정상'
                      ? 'bg-green-200'
                      : file.result === '악성'
                        ? 'bg-red-200'
                        : file.result === '분석중'
                          ? 'bg-yellow-200'
                          : 'bg-gray-200'
                  }`}>
                    <svg className={`h-5 w-5 ${
                      file.result === '정상'
                        ? 'text-green-700'
                        : file.result === '악성'
                          ? 'text-red-700'
                          : file.result === '분석중'
                            ? 'text-yellow-800'
                            : 'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                        file.result === '정상'
                          ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                          : 'M6 18L18 6M6 6l12 12'
                      } />
                    </svg>
                  </span>
                </div>
                <div className="max-w-[180px] md:max-w-[240px] lg:max-w-[320px]">
                  <p className="text-sm font-medium text-gray-900 break-all whitespace-normal">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(() => {
                      const date = new Date(file.date || file.uploadedAt);
                      return date instanceof Date && !isNaN(date) ? date.toLocaleString('ko-KR') : '날짜 정보 없음';
                    })()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-4 min-w-[180px]">
                <span className={`text-sm font-semibold rounded-full px-2 py-1 whitespace-nowrap text-center ${
                  file.result === '정상'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : file.result === '악성'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : file.result === '분석중'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}>
                  {file.result === '정상'
                    ? '정상'
                    : file.result === '악성'
                      ? '악성'
                      : file.result === '분석중'
                        ? '분석중'
                        : '정보 없음'}
                </span>
                <button
                  onClick={() => {
                    sessionStorage.setItem("lastViewedAnalysisId", file.analysis_id);
                    setCurrentResult(file);
                    setFileList(prev =>
                      prev.map(f => f.analysis_id === file.analysis_id ? { ...f, expanded: !f.expanded } : f)
                    );
                  }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  결과 보기
                </button>
                {file.report_url && (
                  <button
                    className="text-sm text-purple-600 hover:underline"
                    onClick={() => {
                      const url = file.report_url.startsWith("http")
                        ? file.report_url
                        : `${import.meta.env.VITE_API_BASE}${file.report_url}`;
                      window.open(url, "_blank");
                    }}
                  >
                    PDF 다운로드
                  </button>
                )}
              </div>
            </div>

            {file.expanded && (
              <>
                <FileAccordionDetail file={file} />
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <span className="relative inline-flex items-center px-2 h-8 border border-gray-200 rounded-r-md text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          }
          previousLabel={
            <span className="relative inline-flex items-center px-2 h-8 border border-gray-200 rounded-l-md text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          containerClassName="flex items-center space-x-1 text-sm"
          pageClassName="w-8 h-8 flex items-center justify-center border-t border-b border-gray-200 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer text-sm transition-colors duration-200"
          pageLinkClassName="w-full h-full flex items-center justify-center"
          activeClassName="w-8 h-8 flex items-center justify-center border-t border-b border-indigo-500 bg-indigo-50 text-indigo-500 font-medium cursor-pointer text-sm"
          breakClassName="relative inline-flex items-center justify-center w-8 h-8 border-t border-b border-gray-200 text-gray-500 text-sm"
          forcePage={currentPage}
        />
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        <span>
          Page <span className="font-semibold text-gray-600">{currentPage + 1}</span> of <span className="font-semibold text-gray-600">{pageCount}</span>
        </span>
        <span className='mr-4 ml-4'>|</span>
        <span>
          Total items: <span className="font-semibold text-gray-600">{visibleFiles.length}</span>
        </span>
      </div>
    </div>
  );
}