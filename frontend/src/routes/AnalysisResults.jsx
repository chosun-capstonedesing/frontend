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

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold">파일 분석 결과</h2>
      <div className="mt-4">
        <p><strong>파일 이름:</strong> {name ?? 'N/A'}</p>
        <p><strong>파일 크기:</strong> {size != null ? size.toLocaleString() : 'N/A'} MB</p>
        <p><strong>확장자:</strong> {extension ?? 'N/A'}</p>
        <p><strong>탐지 결과:</strong> {result ?? 'N/A'}</p>
        <p><strong>신뢰도:</strong> {confidence ?? 'N/A'}%</p>
      </div>
      <div className="my-6">
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
        />
      </div>

      {isLoggedIn && (
        <div className="space-y-2 border-t pt-4">
          <p><strong>SHA-256 해시:</strong> {hash ?? 'N/A'}</p>
          <p><strong>분석 시작 시간:</strong> {analysisStartTime ?? 'N/A'}</p>
          <p><strong>모델 로딩 시간:</strong> {modelLoadingTime ?? 'N/A'}</p>
          <p><strong>전처리 시간:</strong> {preprocessingTime ?? 'N/A'}</p>
          <p><strong>추론 시간:</strong> {inferenceTime ?? 'N/A'}</p>
          <p><strong>악성 확률:</strong> {maliciousProbability ?? 'N/A'}%</p>
          <div>
            <strong>권장 조치:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 text-sm text-gray-700 dark:text-gray-300">
              {(recommendation ?? []).map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisResults;