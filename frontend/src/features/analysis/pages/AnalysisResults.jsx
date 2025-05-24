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
  const { analysisId: paramId } = useParams();
  const [analysisId, setAnalysisId] = useState(paramId || null);
  console.log("useParams:", useParams());
  const lastViewedId = localStorage.getItem("lastViewedAnalysisId");
  const [fileData, setFileData] = useState(null);
  console.log("[분석결과탭] 초기 렌더링됨");
  console.log("분석 결과 페이지 - useParams analysisId:", analysisId);
  console.log("분석 결과 페이지 - localStorage 마지막 ID:", lastViewedId);

  // Helper function to load analysis data from localStorage
  const loadAnalysisData = (id) => {
    const saved = localStorage.getItem(id);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("[분석결과탭] 로딩된 로컬 데이터:", parsed);
        setFileData(parsed);
        // analysis_id가 있으면 상태 및 세션스토리지 동기화
        if (parsed.analysis_id) {
          setAnalysisId(parsed.analysis_id);
          const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
          let updatedSession = sessionFiles.filter(f => f.analysis_id !== parsed.analysis_id);
          updatedSession.push({ ...parsed, status: "done" });
          sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedSession));
        }
        return parsed;
      } catch (e) {
        console.error("분석 결과 파싱 실패:", e);
      }
    }
  };

  useEffect(() => {
    if (paramId) {
      console.log("[분석결과탭] paramId 기반 analysisId:", paramId);
      localStorage.setItem("lastViewedAnalysisId", paramId);
      loadAnalysisData(paramId);
      setAnalysisId(paramId);
    } else {
      // Fallback: try sessionStorage uploadedFiles first
      const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
      console.log("[분석결과탭] paramId 없음, sessionFiles:", sessionFiles);
      if (sessionFiles && sessionFiles.length > 0) {
        // Sort by start_time
        const sortedSession = sessionFiles
          .map(f => ({ ...f, time: new Date(f.log?.start_time) }))
          .sort((a, b) => b.time - a.time);
        const latest = sortedSession[0];
        if (latest?.analysis_id) {
          console.log("[분석결과탭] sessionFiles에서 최신 analysisId 선택:", latest.analysis_id);
          setAnalysisId(latest.analysis_id);
          loadAnalysisData(latest.analysis_id);
          return;
        } else {
          console.log("[분석결과탭] sessionFiles에 analysis_id 없음, fallback 진행");
        }
      } else {
        console.log("[분석결과탭] sessionFiles 비어있음, localStorage fallback 진행");
      }
      // Fallback: localStorage에서 최근 분석 찾기
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
      console.log("[분석결과탭] localStorage에서 최근 분석 목록:", recent);
      if (recent.length > 0) {
        const latestId = recent[0].id;
        console.log("[분석결과탭] localStorage에서 최신 analysisId 선택:", latestId);
        setAnalysisId(latestId);
        loadAnalysisData(latestId);
      } else {
        console.log("[분석결과탭] localStorage에도 최근 분석 없음");
      }
    }
  }, [paramId]);

  useEffect(() => {
    if (fileData?.analysis_id) {
      const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
      let updatedSession = sessionFiles.filter(f => f.analysis_id !== fileData.analysis_id);
      updatedSession.push({ ...fileData, status: "done" });
      sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedSession));
      // Also update localStorage based on deletedAnalysisIds
      const deletedIds = JSON.parse(sessionStorage.getItem("deletedAnalysisIds") || "[]");
      if (deletedIds.includes(fileData.analysis_id)) {
        localStorage.removeItem(fileData.analysis_id);
      }
    }
  }, [fileData]);

  if (!fileData) {
    console.log("[분석결과탭] fileData 없음, analysisId:", analysisId);
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center text-gray-800 mt-20">
        <p className="text-lg font-semibold">분석 결과를 확인할 수 없습니다.</p>
        <p className="text-sm mt-2">먼저 분석을 진행해주세요.</p>
      </div>
    );
  }

  const fileName = fileData.filename;
  const fileSize = fileData.file_size;
  const fileExtension = fileData.extension;
  const resultLabel = fileData.result;
  const confidenceValue = fileData.confidence;
  const startTime = fileData.log?.start_time;
  const modelLoad = fileData.log?.model_load;
  const preprocess = fileData.log?.preprocess;
  const inference = fileData.log?.inference;
  const sha256 = fileData.sha256;
  const probability = fileData.malicious;
  const modelType = fileData.model_info?.type;
  const modelInput = fileData.model_info?.input;

  const normalProbability = fileData?.normal ?? 0;
  const malwareProbability = typeof fileData?.malicious === 'number'
    ? fileData.malicious * 100
    : typeof probability === 'number'
      ? probability * 100
      : 0;
  const reportUrl = fileData?.report_url ?? null;

  const barData = {
    labels: ["정상 확률", "악성 확률"],
    datasets: [
      {
        label: "탐지 확률 (%)",
        data: [
          typeof normalProbability === 'number' ? normalProbability * 100 : 0,
          malwareProbability
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

  const actualIsLoggedIn = import.meta.env.MODE === "development" || !!localStorage.getItem("access_token");

  return (
    <div>
      <div className="space-y-6 md:space-y-0 md:flex md:space-x-6">
        {/* 카드 1: 기본 정보 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:w-1/2">
          <h3 className="text-2xl font-semibold mb-4">분석 결과</h3>
          <div className="space-y-2">
            <p><strong>분석 ID:</strong> {analysisId ?? 'N/A'}</p>
            <p className="break-all"><strong>SHA-256 해시:</strong> {sha256}</p>
            <p className="break-all"><strong>파일 이름:</strong> {fileName}</p>
            <p><strong>파일 크기:</strong> {fileSize !== 'N/A' ? (typeof fileSize === 'number' ? fileSize.toLocaleString() : fileSize) : 'N/A'}</p>
            <p><strong>확장자:</strong> {fileExtension}</p>
            <p><strong>분석 시작 시간:</strong> {startTime}</p>
            <p><strong>탐지 결과:</strong> {resultLabel}</p>
            <p><strong>악성 확률:</strong> {malwareProbability ?? 'N/A'}%</p>
            <p><strong>정상 확률:</strong> {fileData?.normal ?? 0}%</p>
            <p><strong>신뢰도:</strong> {confidenceValue}{confidenceValue !== 'N/A' ? '%' : ''}</p>
          </div>
        </div>

        {/* 카드 2: 그래프 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">탐지 확률 비교</h3>
          <Bar
            data={barData}
            options={barOptions}
            height={300}
            width={400}
          />
        </div>
      </div>

      {/* PDF 버튼 */}
      <div className="flex justify-end mt-4">
        {actualIsLoggedIn ? (
          <button
            className="inline-flex items-center px-5 py-2 text-base bg-blue-100 text-blue-600 rounded-2xl shadow-xl hover:bg-blue-200 transition-colors"
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
  );
}

export default AnalysisResults;