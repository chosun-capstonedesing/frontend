import React from "react";

/**
 * DragAndDrop 컴포넌트
 * - 드래그 앤 드롭 영억 전용 컴포넌트
 * - onDrop: 파일이 드롭되었을 때 호출되는 핸들러
 * - onDragOver: 드래그 오버 시 호출되는 핸들러 -> 기본 동작 방지
 * - children: 내부에 표시할 컨텐츠 -> 파일 선택 버튼 등
 */

function DragAndDrop ({ onDrop, onDragOver, children }) {
    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className=""
        >
            {children}
        </div>
    );
}

export default DragAndDrop;