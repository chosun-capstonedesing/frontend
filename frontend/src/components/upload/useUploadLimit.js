// useUploadLimit.js

import { useState, useEffect } from "react";
import axios from "axios";

// 로그인 여부 판단 함수
function isActuallyLoggedIn() {
  const token = localStorage.getItem("access_token");
  return !!token;
}

// 업로드 제한 관련 커스텀 훅
export function useUploadLimit() {
  const [remainingInfo, setRemainingInfo] = useState(null);

  // client_uuid 쿠키 생성 (없을 경우)
  useEffect(() => {
    if (!document.cookie.includes("client_uuid")) {
      const uuid = crypto.randomUUID();
      document.cookie = `client_uuid=${uuid}; path=/; max-age=86400`;
      console.log("✅ client_uuid 쿠키 생성됨:", uuid);
    }
  }, []);

  // 업로드 가능 횟수 조회
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const response = await axios.get("/api/limit/upload-remaining", {
          withCredentials: true, // 쿠키 포함
        });
        setRemainingInfo(response.data);
      } catch (err) {
        console.error("❌ 업로드 제한 정보 조회 실패:", err);
      }
    };
    fetchRemaining();
  }, []);

  // 업로드 제한 수 설정
  const maxCount = isActuallyLoggedIn() ? Infinity : 3;

  return {
    maxCount,
    remainingInfo,
    isActuallyLoggedIn,
  };
}