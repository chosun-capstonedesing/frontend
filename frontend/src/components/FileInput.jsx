import React from "react";

function FileInput ({ onFileChange, inputRef, id}) {
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