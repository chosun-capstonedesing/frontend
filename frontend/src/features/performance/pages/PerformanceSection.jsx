import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * 모델 분석 환경 페이지 관련 UI 컴포넌트
 * - 테스트 샘플 리스트, 예측 결과, 실제 결과, 성능 지표 등
 */

function PerformanceSection() {
    const [performance, setPerformance] = useState(null);
    const [logInfo, setLogInfo] = useState(null);
    const [activeAnalysisId, setActiveAnalysisId] = useState(null);

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
            const latestData = localStorage.getItem(recent[0].id);
            setActiveAnalysisId(recent[0].id);
            try {
              const parsed = JSON.parse(latestData);
              if (parsed) {
                setLogInfo(parsed.log ?? null);
                setPerformance({
                  overallAccuracy: parsed.model_info?.test_accuracy ?? 'N/A',
                  precision: parsed.performance?.Precision ?? 'N/A',
                  recall: parsed.performance?.Recall ?? 'N/A',
                  f1Score: parsed.performance?.["F1-Score"] ?? 'N/A',
                  benignAccuracy: parsed.performance?.["Benign Accuracy"] ?? 'N/A',
                  malwareAccuracy: parsed.performance?.["Malware Accuracy"] ?? 'N/A',
                  processingTime: parsed.log?.model_load + parsed.log?.preprocess + parsed.log?.inference ?? 'N/A',
                  reportGenerationTime: null,
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
              }
            } catch (e) {
              console.error("로컬 분석 로그 파싱 실패:", e);
            }
          }
        }
      };

      fetchPerformanceData();
    }, []);

    if (!performance) {
        console.log("성능 데이터 없음. 현재 상태:", performance);
    }

    if (!performance || !logInfo) {
      return (
        <div className="bg-white shadow-sm rounded p-6 text-center text-gray-800 mt-10">
          <h2 className="text-lg font-semibold mb-2">먼저 분석을 진행해주세요.</h2>
          <p className="text-sm">분석 결과에 사용된 모델 정보가 나타납니다.</p>
        </div>
      );
    }

    const predictionData = {
        labels: ['정상', '악성'],
        datasets: [
            {
                label: '예측 수',
                data: [
                    performance?.normalCount ?? 0,
                    performance?.maliciousCount ?? 0
                ],
                backgroundColor: '#60A5FA',
            },
        ],
    };

    const accuracyData = {
        labels: ['정확도', '정밀도', '재현율', 'F1-score'],
        datasets: [
            {
                label: '성능 (%)',
                data: performance?.accuracyMetrics ?? [],
                backgroundColor: '#34D399',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
    };

    return (
        <div className="bg-white shadow-sm rounded p-6">
            <h2 className="text-2xl font-bold mb-6">모델 성능</h2>

            <div>
                <h3 className="text-xl font-semibold mb-2">성능 지표</h3>
                <ul className="list-disc list-inside text-base leading-relaxed">
                    <li><span className="font-bold">정확도:</span> {performance?.overallAccuracy ?? 'N/A'}%</li>
                    <li><span className="font-bold">정밀도 (Precision):</span> {performance?.precision ?? 'N/A'}%</li>
                    <li><span className="font-bold">재현율 (Recall):</span> {performance?.recall ?? 'N/A'}%</li>
                    <li><span className="font-bold">F1-score:</span> {performance?.f1Score ?? 'N/A'}%</li>
                    <li><span className="font-bold">정상 탐지 정확도:</span> {performance?.benignAccuracy ?? 'N/A'}%</li>
                    <li><span className="font-bold">악성 탐지 정확도:</span> {performance?.malwareAccuracy ?? 'N/A'}%</li>
                    <li><span className="font-bold">처리 속도:</span> {performance?.processingTime ?? 'N/A'}초</li>
                    <li><span className="font-bold">리포트 생성 시간:</span> {performance?.reportGenerationTime ?? 'N/A'}초</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <h3 className="text-xl font-semibold mb-2">예측 결과 분포</h3>
                    <Bar data={predictionData} options={chartOptions} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">모델 성능 요약</h3>
                    <Bar data={accuracyData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">분석 환경</h3>
                <ul className="list-disc list-inside text-base leading-relaxed">
                    <li><span className="font-bold">모델명:</span> {performance?.environment?.modelName ?? 'N/A'}</li>
                    <li><span className="font-bold">학습 데이터셋:</span> {performance?.environment?.dataset ?? 'N/A'}</li>
                    <li><span className="font-bold">학습 에폭 수:</span> {performance?.environment?.epochs ?? 'N/A'}</li>
                    <li><span className="font-bold">배치 크기:</span> {performance?.environment?.batchSize ?? 'N/A'}</li>
                    <li><span className="font-bold">학습 최적화 도구:</span> {performance?.environment?.optimizer ?? 'N/A'}</li>
                    <li><span className="font-bold">평가지표:</span> {(performance?.environment?.metrics || []).join(', ')}</li>
                    <li><span className="font-bold">사용한 라이브러리:</span> {(performance?.environment?.libraries || []).join(', ')}</li>
                </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">로그 정보</h3>
              <ul className="list-disc list-inside text-base leading-relaxed">
                <li><span className="font-bold">분석 ID:</span> {activeAnalysisId ?? 'N/A'}</li>
                <li><span className="font-bold">분석 시작 시간:</span> {logInfo?.start_time ?? 'N/A'}</li>
                <li><span className="font-bold">모델 로딩 시간:</span> {logInfo?.model_load ?? 'N/A'}초</li>
                <li><span className="font-bold">전처리 시간:</span> {logInfo?.preprocess ?? 'N/A'}초</li>
                <li><span className="font-bold">추론 시간:</span> {logInfo?.inference ?? 'N/A'}초</li>
              </ul>
            </div>
        </div>
    );
}

export default PerformanceSection;