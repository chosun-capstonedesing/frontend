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

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const response = await axios.get("/api/performance"); // 엔드포인트는 백엔드에 맞게 수정
                setPerformance(response.data);
            } catch (error) {
                console.error("성능 데이터 불러오기 실패:", error);
            }
        };

        fetchPerformanceData();
    }, []);

    if (!performance) {
        return <div className="p-6">로딩 중...</div>;
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
            <h2 className="text-2xl font-bold mb-4">모델 성능</h2>

            <div>
                <h3 className="text-lg font-bold mb-2">성능 지표</h3>
                <ul className="list-disc list-inside">
                    <li>정확도: {performance?.overallAccuracy ?? 'N/A'}%</li>
                    <li>처리 속도: {performance?.processingTime ?? 'N/A'}초</li>
                    <li>리포트 생성 시간: {performance?.reportGenerationTime ?? 'N/A'}초</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <h3 className="text-lg font-bold mb-2">예측 결과 분포</h3>
                    <Bar data={predictionData} options={chartOptions} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">모델 성능 요약</h3>
                    <Bar data={accuracyData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">분석 환경</h3>
                <ul className="list-disc list-inside text-gray-700">
                    <li>모델명: {performance?.environment?.modelName ?? 'N/A'}</li>
                    <li>학습 데이터셋: {performance?.environment?.dataset ?? 'N/A'}</li>
                    <li>학습 에폭 수: {performance?.environment?.epochs ?? 'N/A'}</li>
                    <li>배치 크기: {performance?.environment?.batchSize ?? 'N/A'}</li>
                    <li>학습 최적화 도구: {performance?.environment?.optimizer ?? 'N/A'}</li>
                    <li>평가지표: {(performance?.environment?.metrics || []).join(', ')}</li>
                    <li>모델 저장 경로: {performance?.environment?.modelPath ?? 'N/A'}</li>
                    <li>사용한 라이브러리: {(performance?.environment?.libraries || []).join(', ')}</li>
                </ul>
            </div>
        </div>
    );
}

export default PerformanceSection;