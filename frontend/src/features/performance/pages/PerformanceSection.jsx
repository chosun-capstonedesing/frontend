import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/**
 * 모델 분석 환경 페이지 관련 UI 컴포넌트
 * - 테스트 샘플 리스트, 예측 결과, 실제 결과, 성능 지표 등
 */

function PerformanceSection() {
  const [performance, setPerformance] = useState(null);
  const [logInfo, setLogInfo] = useState(null);
  const [activeAnalysisId, setActiveAnalysisId] = useState(null);
  const { analysis_id: analysisId } = useParams();
  const [recentAnalysisId, setRecentAnalysisId] = useState(null);
  console.log("모델 성능 페이지 - 파일 ID:", analysisId ?? recentAnalysisId);

  const parseAndSetPerformance = (parsed, analysisIdToSet) => {
    setLogInfo(parsed.log ?? null);
    setPerformance({
      overallAccuracy: parsed.model_info?.test_accuracy ?? 'N/A',
      precision: parsed.performance?.Precision ?? 'N/A',
      recall: parsed.performance?.Recall ?? 'N/A',
      f1Score: parsed.performance?.["F1-Score"] ?? 'N/A',
      benignAccuracy: parsed.performance?.["Benign Accuracy"] ?? 'N/A',
      malwareAccuracy: parsed.performance?.["Malware Accuracy"] ?? 'N/A',
      processingTime: typeof parsed.log?.model_load === 'number' &&
                      typeof parsed.log?.preprocess === 'number' &&
                      typeof parsed.log?.inference === 'number'
        ? parsed.log.model_load + parsed.log.preprocess + parsed.log.inference
        : 'N/A',
      accuracyMetrics: [
        parsed.model_info?.test_accuracy ?? 0,
        parsed.performance?.Precision ?? 0,
        parsed.performance?.Recall ?? 0,
        parsed.performance?.["F1-Score"] ?? 0,
      ],
      normalCount: parsed.normal ?? 0,
      maliciousCount: parsed.malicious ?? 0,
      environment: parsed.model_info ? {
        modelName: parsed.model_info?.type ?? 'N/A',
        dataset: '사용된 데이터셋 정보 없음',
        epochs: 'N/A',
        batchSize: 'N/A',
        optimizer: 'N/A',
        metrics: [],
        modelPath: 'N/A',
        libraries: [parsed.model_info?.input],
      } : null
    });
    if (parsed?.analysis_id) {
      const sessionFiles = JSON.parse(sessionStorage.getItem("uploadedFiles") || "[]");
      const updatedSession = sessionFiles.map((f) =>
        f.analysis_id === parsed.analysis_id
          ? { ...f, ...parsed, status: "done" }
          : f
      );
      sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedSession));
      const deletedKeys = JSON.parse(sessionStorage.getItem("deletedAnalysisIds") || "[]");
      if (deletedKeys.includes(parsed.analysis_id)) {
        localStorage.removeItem(parsed.analysis_id);
        const updated = updatedSession.filter(f => f.analysis_id !== parsed.analysis_id);
        sessionStorage.setItem("uploadedFiles", JSON.stringify(updated));
      }
    }
    setActiveAnalysisId(analysisIdToSet);
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get("/api/performance");
        setPerformance(response.data);
        if (response.data?.log) {
          setLogInfo(response.data.log);
        }
      } catch (error) {
        console.warn("백엔드 성능 데이터 불러오기 실패. 로컬에서 최근 분석 결과를 사용합니다.");

        // 분석 ID가 있으면 해당 ID로, 없으면 최신 분석 사용
        if (analysisId) {
          const saved = localStorage.getItem(analysisId);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              parseAndSetPerformance(parsed, analysisId);
            } catch (e) {
              console.error("분석 성능 파싱 실패:", e);
            }
          }
        } else {
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
            setActiveAnalysisId(latestId);
            try {
              const parsed = JSON.parse(latestData);
              parseAndSetPerformance(parsed, latestId);
            } catch (e) {
              console.error("최근 성능 로그 파싱 실패:", e);
            }
          }
        }
      }
    };
    fetchPerformanceData();
    // eslint-disable-next-line
  }, [analysisId]);

  if (!performance) {
    console.log("성능 데이터 없음. 현재 상태:", performance);
  }

  if (!performance || !logInfo) {
    return (
      <div className="bg-white shadow-md rounded p-6 text-center text-gray-800 mt-20">
        <p className="text-lg font-semibold">분석에 사용된 모델 정보를 확인할 수 없습니다.</p>
        <p className="text-sm mt-2">먼저 분석을 진행해주세요.</p>
      </div>
    );
  }

  const predictionData = {
    labels: ['정상', '악성'],
    datasets: [
      {
        label: '예측 확률',
        data: [
          typeof performance?.normalCount === 'number' ? performance.normalCount * 100 : 0,
          typeof performance?.maliciousCount === 'number' ? performance.maliciousCount * 100 : 0
        ],
        backgroundColor: ['#60A5FA', '#F87171'],
      },
    ],
  };

  const accuracyData = {
    labels: ['정확도', '정밀도', '재현율', 'F1-score'],
    datasets: [
      {
        label: '성능 (%)',
        data: [
          performance?.overallAccuracy ?? 0,
          performance?.precision ?? 0,
          performance?.recall ?? 0,
          performance?.f1Score ?? 0
        ],
        backgroundColor: ['#34D399', '#FBBF24', '#60A5FA', '#F87171'],
        borderRadius: 6,
        barThickness: 50,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  const totalTime = (logInfo?.model_load ?? 0) + (logInfo?.preprocess ?? 0) + (logInfo?.inference ?? 0);

  return (
    <div className="bg-white shadow-sm rounded p-6">
      <h2 className="text-2xl font-bold mb-6">모델 성능</h2>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">분석 파일 정보</h3>
          <ul className="list-disc list-inside text-base leading-relaxed">
            <li><span className="font-bold">분석 ID:</span> {activeAnalysisId ?? 'N/A'}</li>
            <li><span className="font-bold">분석 시작 시간:</span> {logInfo?.start_time ?? 'N/A'}</li>
            <li><span className="font-bold">모델 로딩 시간:</span> {logInfo?.model_load ?? 'N/A'}초</li>
            <li><span className="font-bold">전처리 시간:</span> {logInfo?.preprocess ?? 'N/A'}초</li>
            <li><span className="font-bold">추론 시간:</span> {logInfo?.inference ?? 'N/A'}초</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">예측 결과 분포</h3>
          <div className="max-w-[200px] mx-auto">
            <Doughnut data={predictionData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 mt-2">분석 환경</h3>
          <ul className="list-disc list-inside text-base leading-relaxed">
            <li><span className="font-bold">모델명:</span> {performance?.environment?.modelName ?? 'N/A'}</li>
            <li><span className="font-bold">학습 데이터셋:</span> {performance?.environment?.dataset ?? 'N/A'}</li>
            <li><span className="font-bold">배치 크기:</span> {performance?.environment?.batchSize ?? 'N/A'}</li>
            <li><span className="font-bold">사용한 라이브러리:</span> {(performance?.environment?.libraries || []).join(', ')}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 mt-2">분석 시간 시각화</h3>
          {
            logInfo && (
              <div className="max-w-[400px] mx-auto">
                <div className="relative h-6 bg-gray-200 rounded overflow-hidden w-full max-w-xl">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    style={{ width: `${((logInfo?.model_load ?? 0) / totalTime) * 100}%` }}
                    title={`모델 로딩: ${logInfo?.model_load ?? 0}s`}
                  />
                  <div
                    className="absolute top-0 h-full bg-yellow-300"
                    style={{
                      left: `${((logInfo?.model_load ?? 0) / totalTime) * 100}%`,
                      width: `${((logInfo?.preprocess ?? 0) / totalTime) * 100}%`
                    }}
                    title={`전처리: ${logInfo?.preprocess ?? 0}s`}
                  />
                  <div
                    className="absolute top-0 h-full bg-rose-400"
                    style={{
                      left: `${(((logInfo?.model_load ?? 0) + (logInfo?.preprocess ?? 0)) / totalTime) * 100}%`,
                      width: `${((logInfo?.inference ?? 0) / totalTime) * 100}%`
                    }}
                    title={`추론: ${logInfo?.inference ?? 0}s`}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-1 max-w-xl">
                  <span>시작 (0s)</span>
                  <span>
                    종료 {(
                      (logInfo?.model_load ?? 0) +
                      (logInfo?.preprocess ?? 0) +
                      (logInfo?.inference ?? 0)
                    ).toFixed(2)}s
                  </span>
                </div>

                <div className="mt-2 text-xs text-gray-500 space-x-4">
                  <span className="inline-flex items-center">
                    <span className="inline-block w-3 h-3 bg-blue-500 mr-1 rounded-sm" />
                    모델 로딩
                  </span>
                  <span className="inline-flex items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-300 mr-1 rounded-sm" />
                    전처리
                  </span>
                  <span className="inline-flex items-center">
                    <span className="inline-block w-3 h-3 bg-rose-400 mr-1 rounded-sm" />
                    추론
                  </span>
                </div>
              </div>
            )
          }
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 mt-12">성능 지표</h3>
          <ul className="list-disc list-inside text-base leading-relaxed">
            <li><span className="font-bold">정확도:</span> {performance?.overallAccuracy ?? 'N/A'}%</li>
            <li><span className="font-bold">정밀도 (Precision):</span> {performance?.precision ?? 'N/A'}%</li>
            <li><span className="font-bold">재현율 (Recall):</span> {performance?.recall ?? 'N/A'}%</li>
            <li><span className="font-bold">F1-score:</span> {performance?.f1Score ?? 'N/A'}%</li>
            <li><span className="font-bold">정상 탐지 정확도:</span> {performance?.benignAccuracy ?? 'N/A'}%</li>
            <li><span className="font-bold">악성 탐지 정확도:</span> {performance?.malwareAccuracy ?? 'N/A'}%</li>
            <li><span className="font-bold">처리 속도:</span> {performance?.processingTime ?? 'N/A'}초</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 mt-12">모델 성능 요약</h3>
          <div className="max-w-xl mx-auto w-full">
            <Bar data={accuracyData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default PerformanceSection;