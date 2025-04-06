import React, { useState } from "react";

function URLSearchForm({ onSearch }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }
    onSearch(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        검색
      </button>
    </form>
  );
}

export default URLSearchForm;