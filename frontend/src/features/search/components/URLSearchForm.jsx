import React, { useState } from "react";
import { isLoggedIn } from "../../../utils/isLoggedIn";

function URLSearchForm({ onSearch }) {
  const [url, setUrl] = useState("");
  const [searchedUrls, setSearchedUrls] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    const maxCount = isLoggedIn() ? Infinity : 10;

    if (searchedUrls.length >= maxCount) {
      alert(`비로그인 사용자는 하루 최대 ${maxCount}개 URL까지만 등록할 수 있습니다.`);
      return;
    }

    onSearch(url);
    setSearchedUrls(prev => [...prev, url]);
    setUrl(""); // 입력창 비우기
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="border px-5 py-2 rounded-2xl shadow-xl flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-xl whitespace-nowrap"
        >
          URL 입력하기
        </button>
      </div>
    </form>
  );
}

export default URLSearchForm;