import React from 'react';

/**
 * TabNavigation 컴포넌트
 * - activeTab: 현재 선택된 탭 상태
 * - setActiveTab: 탭 클릭 시 상태를 변경하는 함수
 */
function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-4 border-b mb-4">
      {/* 분석 탭 */}
      <button
        className={`px-4 py-2 font-semibold ${
          activeTab === 'analysis' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
        }`}
        onClick={() => setActiveTab('analysis')}
      >
        분석
      </button>

      {/* 성능 탭 */}
      <button
        className={`px-4 py-2 font-semibold ${
          activeTab === 'performance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
        }`}
        onClick={() => setActiveTab('performance')}
      >
        성능
      </button>

      {/* 가이드 탭 */}
      <button
        className={`px-4 py-2 font-semibold ${
          activeTab === 'guide' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
        }`}
        onClick={() => setActiveTab('guide')}
      >
        가이드
      </button>
    </div>
  );
}

export default TabNavigation;