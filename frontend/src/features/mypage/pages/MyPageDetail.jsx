import React from 'react';

export default function FileAccordionDetail({ file }) {
  if (!file) {
    return <div className="p-4 text-red-500">파일 정보가 없습니다.</div>;
  }

  const matchedData = Object.keys(localStorage).map((key) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed?.hash === file.hash ? parsed : null;
    } catch {
      return null;
    }
  }).filter(Boolean)[0];

  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-4">
      <h2 className="text-lg font-semibold mb-2">파일 분석 결과</h2>
      <ul className="space-y-1 text-sm">
        <li className='pb-2.5'><strong className='text-base'>파일 분석 정보 (File Analysis Information)</strong>
          <ul className="mt-1 space-y-1 pl-1">
            <li><strong>- 파일 이름: </strong>{file.name}</li>
            <li><strong>- 파일 크기: </strong>{file.size ? file.size.toLocaleString() : 'N/A'} MB</li>
            <li><strong>- 확장자: </strong>{file.name?.split('.').pop() || 'N/A'}</li>
            <li><strong>- SHA-256 Hash: </strong>{file.hash || 'N/A'}</li>
          </ul>
        </li>

        <li className='pb-2'><strong className='text-base'>업로드 날짜 (Upload Date):</strong> {(file.uploadedAt || new Date().toLocaleDateString())}</li>

        <li className='pb-2.5'><strong className='text-base'>탐지 결과 (Detection result)</strong>
          <p className='mt-1 pl-1'> 해당 "<strong>{file.name}</strong>" 파일은 <strong>{matchedData?.result || file.result}</strong>으로 탐지되었으며, <strong>{(matchedData?.probability ?? file.probability) || 'N/A'}%</strong>의 탐지 확률을 기반으로 판단됩니다.</p>
          <p className="text-xs text-gray-500 mt-1 pl-1">※ 악성 확률이 60% 이상일 경우 '악성'으로 판별합니다.</p>
        </li>

        <li className='pb-2.5'>
          <strong className='text-base'>분석 로그 요약 (Analysis Log Summary)</strong>
          <ul className="mt-1 space-y-1 pl-1">
            <li><strong>- 분석 시작 시간: </strong>{matchedData?.analysisStartedAt || file.analysisStartedAt || 'N/A'}</li>
            <li><strong>- 모델 로딩 시간: </strong>{matchedData?.log?.model_load ?? 'N/A'}초</li>
            <li><strong>- 파일 전처리 시간: </strong>{matchedData?.log?.preprocess ?? 'N/A'}초</li>
            <li><strong>- 추론 시간: </strong>{matchedData?.log?.inference ?? 'N/A'}초</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}