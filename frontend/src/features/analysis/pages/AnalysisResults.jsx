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
  recommendation,
  performance = {},
  modelInfo = {}
}) {
  const { id } = useParams();
  console.log("분석 결과 페이지 - 파일 ID:", id);

  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem("analysis_results");
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      if (parsed && id && parsed[id]) {
        setFileData(parsed[id]);
      }
    }
  }, [id]);

  const fileName = name ?? fileData?.name ?? 'N/A';
  const fileSize = size ?? fileData?.size ?? 'N/A';
  const fileExtension = extension ?? fileData?.extension ?? 'N/A';
  const resultLabel = result ?? fileData?.result ?? 'N/A';
  const confidenceValue = confidence ?? fileData?.confidence ?? 'N/A';
  const sha256 = hash ?? fileData?.hash ?? 'N/A';
  const startTime = analysisStartTime ?? fileData?.analysisStartTime ?? 'N/A';
  const modelLoad = modelLoadingTime ?? fileData?.modelLoadingTime ?? 'N/A';
  const preprocess = preprocessingTime ?? fileData?.preprocessingTime ?? 'N/A';
  const inference = inferenceTime ?? fileData?.inferenceTime ?? 'N/A';
  const probability = maliciousProbability ?? fileData?.maliciousProbability ?? 'N/A';
  const modelType = modelInfo?.type ?? fileData?.modelInfo?.type ?? 'N/A';
  const modelInput = modelInfo?.input ?? fileData?.modelInfo?.input ?? 'N/A';

  const defaultMaliciousProbability = probability !== 'N/A' ? probability : 65; // 예: 기본값 65%

  const barData = {
    labels: ["정상 확률", "악성 확률"],
    datasets: [
      {
        label: "탐지 확률 (%)",
        data: [
          defaultMaliciousProbability !== 'N/A'
            ? 100 - defaultMaliciousProbability
            : 0,
          defaultMaliciousProbability !== 'N/A'
            ? defaultMaliciousProbability
            : 0
        ],
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

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">파일 분석 결과</h2>
      <div className="flex flex-col md:grid md:grid-cols-[1fr_1.2fr] gap-4 mt-4">
        <div>
          <div className="mt-4">
            <p className="text-base"><strong>분석 ID:</strong> {id ?? 'N/A'}</p>
            <p className="text-base"><strong>파일 이름:</strong> {fileName}</p>
            <p className="text-base"><strong>파일 크기:</strong> {fileSize !== 'N/A' ? (typeof fileSize === 'number' ? fileSize.toLocaleString() : fileSize) : 'N/A'} MB</p>
            <p className="text-base"><strong>확장자:</strong> {fileExtension}</p>
            <p className="text-base"><strong>탐지 결과:</strong> {resultLabel}</p>
            <p className="text-base"><strong>신뢰도:</strong> {confidenceValue}{confidenceValue !== 'N/A' ? '%' : ''}</p>
          </div>
          {isLoggedIn && (
            <div className="space-y-2 border-t pt-4">
              <p className="text-base"><strong>SHA-256 해시:</strong> {sha256}</p>
              <p className="text-base"><strong>분석 시작 시간:</strong> {startTime}</p>
              <p className="text-base"><strong>모델 로딩 시간:</strong> {modelLoad}</p>
              <p className="text-base"><strong>전처리 시간:</strong> {preprocess}</p>
              <p className="text-base"><strong>추론 시간:</strong> {inference}</p>
              <p className="text-base"><strong>악성 확률:</strong> {probability}{probability !== 'N/A' ? '%' : ''}</p>
              <p className="text-base"><strong>모델 종류:</strong> {modelType}</p>
              <p className="text-base"><strong>입력 정보:</strong> {modelInput}</p>
            </div>
          )}
        </div>
        <div>
          <div className="mb-6 w-full flex items-end justify-start">
            <Bar
              data={{
                labels: ["정상 확률", "악성 확률"],
                datasets: [
                  {
                    label: "탐지 확률 (%)",
                    data:
                      probability !== 'N/A'
                        ? [100 - probability, probability]
                        : [0, 0],
                    backgroundColor: ["#4ade80", "#f87171"],
                    borderRadius: 5,
                  },
                ],
              }}
              options={barOptions}
              height={400}
              width={580}
            />
          </div>
          <div className="mt-8 flex justify-end">
            {isLoggedIn ? (
              <button
                className="inline-flex items-center px-5 py-2 text-base bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => alert("PDF 다운로드 기능은 백엔드 연동 후 구현됩니다.")}
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