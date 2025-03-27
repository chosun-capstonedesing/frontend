import React from "react";

/**
 * 모델 성능 검증 페이지 관련 UI 컴포넌트
 * - 테스트 샘플 리스트, 예측 결과, 실제 결과, 성능 지표 등
 */

function PerformanceSection() {
    return (
        <div className="bg-white shadow-sm rounded p-6">
            <h2 className="text-xl font-bold mb-4">모델 성능 검증</h2>
            <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead>
                    <tr className="px-6 py-3 text-left">샘플</tr>
                    <tr className="px-6 py-3 text-left">예측 결과</tr>
                    <tr className="px-6 py-3 text-left">실제 정답</tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4">Sample 1</td>
                        <td className="px-6 py-4">정상</td>
                        <td className="px-6 py-4">정상</td>
                    </tr>

                    <tr>
                        <td className="px-6 py-4">Sample 2</td>
                        <td className="px-6 py-4">악성</td>
                        <td className="px-6 py-4">악성</td>
                    </tr>
                </tbody>
            </table>

            <div>
                <h3 className="text-lg font-bold mb-2">성능 지표</h3>
                <ul className="list-disc list-inside">
                    <li>정확도: 95%</li>
                    <li>처리 속도: 1.2초</li>
                    <li>리포트 생성 시간: 2.3초</li>
                </ul>
            </div>

            <div className="mt-4">
                <p>그래프 영역</p>
            </div>
        </div>
    );
}

export default PerformanceSection;