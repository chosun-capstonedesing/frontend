import axios from "axios";

export async function runRemainingTest() {
    console.log("🧪 업로드 제한 조회 테스트 시작");

    try {
        console.log("🍪 현재 document.cookie:", document.cookie);
        const response = await axios.get("http://13.125.214.199:8000/limit/upload-remaining", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (
          typeof response.data.used === 'number' &&
          typeof response.data.remaining === 'number' &&
          typeof response.data.limit === 'number'
        ) {
          console.log("🟢 업로드 제한 응답 구조 테스트 성공:", response.data);
        } else {
          console.warn("🟠 응답 필드 형식이 예상과 다름:", response.data);
        }
        console.log("✅ 업로드 제한 정보:", response.data);
    } catch (error) {
        console.error("❌ 업로드 제한 조회 실패", error);
    }

    console.log("✅ 업로드 제한 테스트 완료");
}