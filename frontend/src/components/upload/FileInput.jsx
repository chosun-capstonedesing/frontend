import React from "react";
import { isLoggedIn } from "../../utils/isLoggedIn";

/** 
 * FileInput 컴포넌트 역할
 * - 파일 선택(input) 전용 컴포넌트
 * - onFileChange: 파일 선택 시 호출되는 이벤트 핸들러
 * - inputRef: 부모에게서 전달받은 ref
 * - id: input 요소의 id(label과 연동)
 */

function FileInput ({ onFileChange, inputRef, id }) {
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        const maxCount = isLoggedIn() ? Infinity : 10;

        if (files.length > maxCount) {
            alert(`비로그인 사용자는 최대 ${maxCount}개 파일까지만 업로드할 수 있습니다.`);
            return;
        }

        if (onFileChange) {
            onFileChange(e);
        }
    };

    return (
        <input
            ref={inputRef}
            type="file"
            onChange={handleChange}
            className="hidden"
            id={id}
        />
    );
}

export default FileInput;