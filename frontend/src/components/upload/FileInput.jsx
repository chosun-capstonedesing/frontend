import React from "react";

/** 
 * FileInput 컴포넌트 역할
 * - 파일 선택(input) 전용 컴포넌트
 * - onFileChange: 파일 선택 시 호출되는 이벤트 핸들러
 * - inputRef: 부모에게서 전달받은 ref
 * - id: input 요소의 id(label과 연동)
 */

function FileInput ({ onFileChange, inputRef, id }) {
    return (
        <input
            ref={inputRef}
            type="file"
            accept=".exe, .dll"
            onChange={onFileChange}
            className="hidden"
            id={id}
        />
    );
}

export default FileInput;