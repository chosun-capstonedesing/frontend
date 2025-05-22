import React from 'react';

export default function FileAccordionDetail({ file }) {
  // Helper function to get matched data from localStorage
  const getMatchedDataFromLocalStorage = (file) => {
    return Object.values(localStorage).map((item) => {
      try {
        const parsed = JSON.parse(item);
        if (parsed?.display_name === null || parsed?.display_name === "null") return null;
        if (!parsed?.sha256 && !parsed?.summary && !parsed?.filename && !parsed?.confidence) return null;

        const fileHash = (file.sha256 ?? file.hash)?.toLowerCase();
        const parsedHash = parsed?.sha256?.toLowerCase();

        // Prefer matching sha256 hash first
        if (parsedHash && fileHash && parsedHash === fileHash) {
          const overallAccuracy = parsed.model_info?.test_accuracy ?? 'N/A';
          const precision = parsed.performance?.Precision ?? 'N/A';
          const recall = parsed.performance?.Recall ?? 'N/A';
          const f1Score = parsed.performance?.["F1-Score"] ?? 'N/A';
          const benignAccuracy = parsed.performance?.["Benign Accuracy"] ?? 'N/A';
          const malwareAccuracy = parsed.performance?.["Malware Accuracy"] ?? 'N/A';
          const processingTime = (
            typeof parsed.log?.model_load === 'number' &&
            typeof parsed.log?.preprocess === 'number' &&
            typeof parsed.log?.inference === 'number'
          )
            ? parsed.log.model_load + parsed.log.preprocess + parsed.log.inference
            : 'N/A';

          return { ...parsed, overallAccuracy, precision, recall, f1Score, benignAccuracy, malwareAccuracy, processingTime };
        }

        // Then check analysis_id if provided
        if (file.analysis_id && parsed.analysis_id && file.analysis_id === parsed.analysis_id) {
          const overallAccuracy = parsed.model_info?.test_accuracy ?? 'N/A';
          const precision = parsed.performance?.Precision ?? 'N/A';
          const recall = parsed.performance?.Recall ?? 'N/A';
          const f1Score = parsed.performance?.["F1-Score"] ?? 'N/A';
          const benignAccuracy = parsed.performance?.["Benign Accuracy"] ?? 'N/A';
          const malwareAccuracy = parsed.performance?.["Malware Accuracy"] ?? 'N/A';
          const processingTime = (
            typeof parsed.log?.model_load === 'number' &&
            typeof parsed.log?.preprocess === 'number' &&
            typeof parsed.log?.inference === 'number'
          )
            ? parsed.log.model_load + parsed.log.preprocess + parsed.log.inference
            : 'N/A';

          return { ...parsed, overallAccuracy, precision, recall, f1Score, benignAccuracy, malwareAccuracy, processingTime };
        }

        // Fallback to summary/filename matching last
        const matchSummary = parsed?.summary === file.summary;
        const matchFilename = parsed?.filename === file.name || parsed?.filename === file.filename;
        const matchConfidence = parsed?.confidence === file.confidence;

        if (matchSummary || (matchFilename && matchConfidence)) {
          const overallAccuracy = parsed.model_info?.test_accuracy ?? 'N/A';
          const precision = parsed.performance?.Precision ?? 'N/A';
          const recall = parsed.performance?.Recall ?? 'N/A';
          const f1Score = parsed.performance?.["F1-Score"] ?? 'N/A';
          const benignAccuracy = parsed.performance?.["Benign Accuracy"] ?? 'N/A';
          const malwareAccuracy = parsed.performance?.["Malware Accuracy"] ?? 'N/A';
          const processingTime = (
            typeof parsed.log?.model_load === 'number' &&
            typeof parsed.log?.preprocess === 'number' &&
            typeof parsed.log?.inference === 'number'
          )
            ? parsed.log.model_load + parsed.log.preprocess + parsed.log.inference
            : 'N/A';

          return { ...parsed, overallAccuracy, precision, recall, f1Score, benignAccuracy, malwareAccuracy, processingTime };
        }
        return null;
      } catch {
        return null;
      }
    }).find(Boolean);
  };

  if (!file) {
    return <div className="p-4 text-red-500">파일 정보가 없습니다.</div>;
  }

  const matchedData = getMatchedDataFromLocalStorage(file);
  const finalData = {
    filename: matchedData?.filename ?? matchedData?.name ?? file.filename ?? file.name,
    name: matchedData?.name ?? file.name,
    file_size: matchedData?.file_size ?? file.file_size,
    size: matchedData?.size ?? file.size ?? matchedData?.size,
    extension: matchedData?.extension,
    sha256: matchedData?.sha256 ?? matchedData?.hash ?? file.sha256 ?? file.hash,
    hash: matchedData?.hash ?? matchedData?.sha256 ?? file.hash ?? file.sha256,
    summary: matchedData?.summary ?? file.summary,
    result: matchedData?.result ?? file.result ?? (matchedData ? (matchedData?.malicious !== undefined ? '분석 완료' : '분석 안됨') : '분석 안됨'),
    malwareAccuracy: matchedData?.malwareAccuracy ?? file.malwareAccuracy,
    report_url: matchedData?.report_url ?? file.report_url ?? null,
    uploadedAt: matchedData?.uploadedAt ?? file.uploadedAt ?? file.upload_time ?? 'N/A',
    confidence: matchedData?.confidence ?? file.confidence ?? 'N/A',
    malicious: typeof matchedData?.malicious === 'number'
      ? matchedData.malicious
      : typeof file.malicious === 'number'
        ? file.malicious
        : parseFloat(matchedData?.malicious ?? file.malicious) || 'N/A',
  };

  const extension = finalData.extension ?? finalData.filename?.split('.').pop() ?? finalData.name?.split('.').pop() ?? 'N/A';

  const sizeValue = finalData.size;
  const formattedSize =
    typeof finalData.file_size === 'string'
      ? finalData.file_size
      : typeof sizeValue === 'number' && !isNaN(sizeValue)
        ? `${(sizeValue / 1024 / 1024).toFixed(2)} MB`
        : 'N/A';

  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-4">
      <h2 className="text-lg font-semibold mb-2">파일 분석 결과</h2>
      <ul className="space-y-1 text-sm">
        <li className='pb-2.5'><strong className='text-base'>파일 분석 정보 (File Analysis Information)</strong>
          <ul className="mt-1 space-y-1 pl-1">
            <li><strong>- 파일 이름: </strong>{finalData.filename ?? finalData.name ?? 'N/A'}</li>
            <li><strong>- 파일 크기: </strong>{formattedSize}</li>
            <li><strong>- 확장자: </strong>{extension}</li>
            <li><strong>- SHA-256 Hash: </strong>{finalData.sha256 ?? finalData.hash ?? 'N/A'}</li>
          </ul>
        </li>

        <li className='pb-2'><strong className='text-base'>업로드 날짜 (Upload Date):</strong> {new Date(finalData.uploadedAt).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}</li>

        <li className='pb-2.5'><strong className='text-base'>탐지 결과 (Detection result)</strong>
          <p className='mt-1 pl-1'>
            {
              matchedData
                ? (finalData.summary ??
                  ((finalData.result === undefined || finalData.result === '분석 완료' || finalData.result === '의심' || finalData.result === '정상' || finalData.result === '악성') && finalData.malicious !== 'N/A'
                    ? `해당 "${finalData.filename ?? finalData.name ?? '파일명없음'}" 파일은 분석 완료되었으며, ${
                        typeof finalData.malicious === 'number'
                          ? finalData.malicious.toFixed(2)
                          : (typeof finalData.malwareAccuracy === 'number'
                            ? finalData.malwareAccuracy.toFixed(2)
                            : 'N/A')
                      }%의 탐지 확률을 기반으로 판단됩니다.`
                    : `해당 "${finalData.filename ?? finalData.name ?? '파일명없음'}" 파일은 ${finalData.result ?? '분석 안됨'}으로 탐지되었으며, ${
                        typeof finalData.malicious === 'number'
                          ? finalData.malicious.toFixed(2)
                          : (typeof finalData.malwareAccuracy === 'number'
                            ? finalData.malwareAccuracy.toFixed(2)
                            : 'N/A')
                      }%의 탐지 확률을 기반으로 판단됩니다.`))
                : '정보 없음'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1 pl-1">※ 악성 확률이 60% 이상일 경우 '악성'으로 판별합니다.</p>
        </li>
      </ul>
    </div>
  );
}