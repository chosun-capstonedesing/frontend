import React from "react";
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
  recommendation
}) {

  const defaultMaliciousProbability = maliciousProbability ?? 65; // 예: 기본값 65%

  const barData = {
    labels: ["정상 확률", "악성 확률"],
    datasets: [
      {
        label: "탐지 확률 (%)",
        data: [100 - defaultMaliciousProbability, defaultMaliciousProbability],
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
            <p className="text-base"><strong>파일 이름:</strong> {name ?? 'N/A'}</p>
            <p className="text-base"><strong>파일 크기:</strong> {size != null ? size.toLocaleString() : 'N/A'} MB</p>
            <p className="text-base"><strong>확장자:</strong> {extension ?? 'N/A'}</p>
            <p className="text-base"><strong>탐지 결과:</strong> {result ?? 'N/A'}</p>
            <p className="text-base"><strong>신뢰도:</strong> {confidence ?? 'N/A'}%</p>
          </div>
          {isLoggedIn && (
            <div className="space-y-2 border-t pt-4">
              <p className="text-base"><strong>SHA-256 해시:</strong> {hash ?? 'N/A'}</p>
              <p className="text-base"><strong>분석 시작 시간:</strong> {analysisStartTime ?? 'N/A'}</p>
              <p className="text-base"><strong>모델 로딩 시간:</strong> {modelLoadingTime ?? 'N/A'}</p>
              <p className="text-base"><strong>전처리 시간:</strong> {preprocessingTime ?? 'N/A'}</p>
              <p className="text-base"><strong>추론 시간:</strong> {inferenceTime ?? 'N/A'}</p>
              <p className="text-base"><strong>악성 확률:</strong> {maliciousProbability ?? 'N/A'}%</p>
              <div>
                <strong>권장 조치:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 text-base text-gray-700 dark:text-gray-300">
                  {(recommendation ?? []).map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
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
                    data: maliciousProbability != null ? [100 - maliciousProbability, maliciousProbability] : [0, 0],
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