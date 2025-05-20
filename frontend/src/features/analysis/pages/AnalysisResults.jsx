import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaLock } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalysisResults({
  name,
  size,
  extension,
  result,
  confidence,
  isLoggedIn,
  hash,
  analysisStartTime,
  modelLoadingTime,
  preprocessingTime,
  inferenceTime,
  maliciousProbability,
  modelInfo = {}
}) {
  const { analysis_id: analysisId } = useParams();
  const [recentAnalysisId, setRecentAnalysisId] = useState(null);
  console.log("분석 결과 페이지 - 파일 ID:", analysisId ?? recentAnalysisId);

  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (analysisId) {
      const saved = localStorage.getItem(analysisId);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFileData(parsed);
        } catch (e) {
          console.error("분석 결과 파싱 실패:", e);
        }
      }
    } else {
      // fallback: get latest analysisId from localStorage
      const allKeys = Object.keys(localStorage);
      const recent = allKeys
        .filter((key) => {
          try {
            const value = JSON.parse(localStorage.getItem(key));
            return value && value.log?.start_time;
          } catch {
            return false;
          }
        })
        .map((key) => ({
          id: key,
          time: new Date(JSON.parse(localStorage.getItem(key)).log.start_time),
        }))
        .sort((a, b) => b.time - a.time);

      if (recent.length > 0) {
        const latestId = recent[0].id;
        setRecentAnalysisId(latestId);
        const latestData = localStorage.getItem(latestId);
        try {
          const parsed = JSON.parse(latestData);
          setFileData(parsed);
        } catch (e) {
          console.error("최근 분석 결과 파싱 실패:", e);
        }
      }
    }
  }, [analysisId]);

  if (!fileData) {
    return (
      <div className="bg-white shadow-md rounded p-6 text-center text-gray-800 mt-20">
        <p className="text-lg font-semibold">분석 결과를 확인할 수 없습니다.</p>
        <p className="text-sm mt-2">먼저 분석을 진행해주세요.</p>
      </div>
    );
  }

  const fileName = fileData?.filename ?? name ?? 'N/A';
  const fileSize = fileData?.file_size ?? size ?? 'N/A';
  const fileExtension = fileData?.extension ?? extension ?? 'N/A';
  const resultLabel = fileData?.result ?? result ?? 'N/A';
  const confidenceValue = fileData?.confidence ?? confidence ?? 'N/A';
  const startTime = fileData?.log?.start_time ?? analysisStartTime ?? 'N/A';
  const modelLoad = fileData?.log?.model_load ?? modelLoadingTime ?? 'N/A';
  const preprocess = fileData?.log?.preprocess ?? preprocessingTime ?? 'N/A';
  const inference = fileData?.log?.inference ?? inferenceTime ?? 'N/A';
  const sha256 = fileData?.sha256 ?? hash ?? 'N/A';
  const probability = fileData?.malicious ?? maliciousProbability ?? 'N/A';
  const modelType = fileData?.model_info?.type ?? modelInfo?.type ?? 'N/A';
  const modelInput = fileData?.model_info?.input ?? modelInfo?.input ?? 'N/A';

  const normalProbability = fileData?.normal ?? 0;
  // Robust malware probability logic
  const malwareAccuracy = Number(fileData?.performance?.["Malware Accuracy"]);
  const malwareProbability = !isNaN(malwareAccuracy)
    ? malwareAccuracy
    : Number(fileData?.malicious ?? probability ?? 0);
  const reportUrl = fileData?.report_url ?? null;

  const barData = {
    labels: ["정상 확률", "악성 확률"],
    datasets: [
      {
        label: "탐지 확률 (%)",
        data: [normalProbability, malwareProbability],
        backgroundColor: ["#4ade80", "#f87171"], // green and red
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "탐지 확률 비교",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (import.meta.env.MODE === "development") {
    isLoggedIn = true;
  }

  const actualIsLoggedIn = typeof isLoggedIn !== "undefined" ? isLoggedIn : !!localStorage.getItem("access_token");

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">파일 분석 결과</h2>
      <div className="flex flex-col md:grid md:grid-cols-[1fr_1.2fr] gap-4 mt-4 break-words overflow-hidden">
        <div>
          <div className="space-y-2 mt-4 mb-4">
            <p className="text-base"><strong>분석 ID:</strong> {analysisId ?? 'N/A'}</p>
            <p className="text-base break-all"><strong>파일 이름:</strong> {fileName}</p>
            <p className="text-base"><strong>파일 크기:</strong> {fileSize !== 'N/A' ? (typeof fileSize === 'number' ? fileSize.toLocaleString() : fileSize) : 'N/A'}</p>
            <p className="text-base"><strong>확장자:</strong> {fileExtension}</p>
            <p className="text-base"><strong>탐지 결과:</strong> {resultLabel}</p>
            <p className="text-base"><strong>악성 확률:</strong> {malwareProbability ?? 'N/A'}%</p>
            <p className="text-base"><strong>정상 확률:</strong> {fileData?.normal ?? 0}%</p>
            <p className="text-base"><strong>신뢰도:</strong> {confidenceValue}{confidenceValue !== 'N/A' ? '%' : ''}</p>
          </div>
          {actualIsLoggedIn && (
            <div className="space-y-2 border-t pt-4 pb-4">
              <p className="text-base break-all"><strong>SHA-256 해시:</strong> {sha256}</p>
              <p className="text-base"><strong>분석 시작 시간:</strong> {startTime}</p>
              <p className="text-base"><strong>모델 로딩 시간:</strong> {modelLoad}</p>
              <p className="text-base"><strong>전처리 시간:</strong> {preprocess}</p>
              <p className="text-base"><strong>추론 시간:</strong> {inference}</p>
              <p className="text-base"><strong>모델 종류:</strong> {modelType}</p>
              <p className="text-base"><strong>입력 정보:</strong> {modelInput}</p>
            </div>
          )}
        </div>
        <div>
          <div className="mb-6 w-full flex items-end justify-start">
            <Bar
              data={barData}
              options={barOptions}
              height={400}
              width={580}
            />
          </div>
          <div className="mt-8 flex justify-end">
            {actualIsLoggedIn ? (
              <button
                className="inline-flex items-center px-5 py-2 text-base bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => {
                  if (reportUrl) {
                    const url = reportUrl.startsWith("http") ? reportUrl : `${import.meta.env.VITE_API_BASE}${reportUrl}`;
                    window.open(url, "_blank");
                  } else {
                    alert("PDF 파일 경로를 찾을 수 없습니다.");
                  }
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                분석 결과 PDF 다운로드
              </button>
            ) : (
              <div className="inline-flex items-center px-5 py-2 text-base bg-blue-100 text-blue-400 rounded-lg cursor-not-allowed border border-blue-200 backdrop-blur-sm bg-opacity-70">
                <FaLock className="w-5 h-5 mr-2 text-blue-300" />
                로그인 시 PDF 다운로드 가능
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;