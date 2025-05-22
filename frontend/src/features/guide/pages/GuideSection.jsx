import React from "react";

/**
 * 사용자 가이드 및 설명 UI 컴포넌트
 * - 웹 동작 방식, 모델 설명 등 설명 추가
 */

function GuideSection() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">사용자 가이드 & 설명</h2>
            <p>
                머신러닝 기반 악성코드 분석을 제공하며, CNN 모델을 사용하여 실행 파일의 정상/악성 여부를 판단합니다.
            </p>

            <p className="mt-2">
                데이터 처리, 모델 학습 및 분석 방법에 대한 자세한 내용은 추가 문서를 참고하세요.
            </p>
        </div>
    );
}

export default GuideSection;