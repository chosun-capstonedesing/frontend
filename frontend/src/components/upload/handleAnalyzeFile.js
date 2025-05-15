import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

if (!handleAnalyzeFile.canceledFlags) {
  handleAnalyzeFile.canceledFlags = {};
}

// 📦 파일 분석 처리 함수 - 인덱스별로 분석을 시작하거나 중지
export async function handleAnalyzeFile(
  index,               // 분석할 파일의 인덱스
  fileList,            // 현재 파일 리스트 상태
  setFileList,         // 파일 리스트 상태 업데이트 함수
  setProgressMap,      // 프로그레스 상태 업데이트 함수
  showToast,           // 알림 표시 함수
  updateProgress,      // 토스트 상태 내 진행률 업데이트 함수
  updateToastStatus,   // 토스트 상태 변경 함수
  onFileSelect         // 분석 완료 후 선택할 콜백 함수
) {
  // 현재 document.cookie 로그 출력 (디버깅용)
  console.log("📦 현재 document.cookie:", document.cookie);

  // 파일 리스트 복사본 생성
  const updatedFiles = [...fileList];
  // 현재 해당 인덱스 파일의 상태 확인
  const currentStatus = updatedFiles[index].status;

  // --- 분석 중지 처리 ---
  if (currentStatus === "processing") {
    // 이전에 설정된 타이머 및 인터벌을 클리어하여 분석 중지
    clearTimeout(handleAnalyzeFile.analysisTimers?.[index]?.timeoutId);
    clearInterval(handleAnalyzeFile.analysisTimers?.[index]?.intervalId);

    // 상태를 'pending'으로 변경하여 분석 중지 표시
    updatedFiles[index].status = "pending";
    setFileList(updatedFiles);
    // 세션 스토리지에 변경된 파일 리스트 저장
    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    // 진행률 상태에서 해당 인덱스 삭제하여 초기화
    setProgressMap((prev) => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });

    handleAnalyzeFile.canceledFlags[index] = true;

    return; // 함수 종료 - 분석 중지 완료
  }

  // --- 분석 시작 처리 ---
  // 상태를 'processing'으로 변경하여 분석 중임 표시
  updatedFiles[index].status = "processing";
  setFileList(updatedFiles);
  // 세션 스토리지에도 변경 사항 저장
  sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

  // 진행률 맵에 해당 인덱스가 없으면 0으로 초기화
  setProgressMap((prev) => {
    if (prev[index] !== undefined) return prev;
    return { ...prev, [index]: 0 };
  });

  // 분석 시작 알림 표시 (토스트)
  showToast(`${updatedFiles[index].name}`, "processing", index);

  // --- 진행률 업데이트 인터벌 설정 ---
  // 약 60ms 간격으로 진행률을 1씩 증가시키며 최대 95%까지 업데이트
  let isResultReceived = false;
  const intervalId = setInterval(() => {
    setProgressMap((prev) => {
      if (!isResultReceived) {
        const current = prev[index] ?? 0;
        const next = Math.min(current + 1, 95); // 점진적이고 느린 증가, 최대 95%까지 허용
        updateProgress(index, next);
        return { ...prev, [index]: next };
      }
      return prev;
    });
  }, 60); // 초기 진행률이 더 빠르게 올라가도록 조정

  // --- 분석 요청 타임아웃 설정 ---
  // 1초 후 실제 분석 API 호출 및 결과 처리 시작
  const timeoutId = setTimeout(async () => {
    // 진행률 업데이트 인터벌 중지
    clearInterval(intervalId);

    // 타이머 관리 객체에서 해당 인덱스 삭제
    if (handleAnalyzeFile.analysisTimers) {
      delete handleAnalyzeFile.analysisTimers[index];
    }

    // FormData 객체 생성 및 파일 첨부
    const formData = new FormData();
    const realFile = updatedFiles[index].file instanceof File
      ? updatedFiles[index].file
      : new File([], updatedFiles[index].name);
    formData.append("file", realFile);

    // 로컬 스토리지 내 파일 결과 업데이트 함수
    const updateLocalStorageResult = (fileName, result) => {
      const localFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
      const updatedLocal = localFiles.map((file) => {
        if (file.name === fileName) {
          return {
            ...file,
            result,
            report_url: result?.report_url,
            display_name: result?.display_name,
          };
        }
        return file;
      });
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedLocal));
    };

    try {
      // 인증 토큰 로컬 스토리지에서 가져오기
      const token = localStorage.getItem("access_token");

      // 백엔드 분석 API 호출
      const res = await axios.post(`${API_BASE}/analyze-full`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })  // 로그인 시 토큰 자동 포함
        },
        withCredentials: true  // client_uuid 쿠키 포함
      });

      // 분석 결과 로그 출력
      console.log("분석 결과:", res.data);

      if (handleAnalyzeFile.canceledFlags[index]) {
        console.log("❌ 분석이 중단된 파일입니다. 결과 무시됨:", index);
        return;
      }

      // 분석 결과가 반환된 경우 부드럽게 100%까지 진행
      let currentProgress = 0;
      setProgressMap((prev) => {
        currentProgress = prev[index] ?? 0;
        return prev;
      });

      isResultReceived = true;
      let progressValue = currentProgress;
      const target = 100;
      const duration = 4000; // 애니메이션을 4초간 더 천천히 진행
      const stepTime = 80;   // 더 느린 단위로 갱신하여 퍼센트 숫자 속도도 느려짐
      const step = (target - progressValue) / (duration / stepTime);

      setTimeout(() => {
        const finalProgressTimer = setInterval(() => {
          progressValue = Math.min(progressValue + step, target);
          setProgressMap((prev) => ({ ...prev, [index]: Math.floor(progressValue) }));

          if (progressValue >= target) {
            clearInterval(finalProgressTimer);

            // 상태를 'done'으로 변경하고 분석 결과 반영
            updatedFiles[index].status = "done";
            setFileList([...updatedFiles]);

            updateLocalStorageResult(updatedFiles[index].name, res.data);

            const updatedStored = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
            const latestFile = updatedStored.find((f) => f.name === updatedFiles[index].name);
            if (latestFile) {
              onFileSelect?.([
                {
                  ...latestFile,
                  report_url: latestFile.report_url,
                  display_name: latestFile.display_name,
                },
              ]);
            }

            delete handleAnalyzeFile.canceledFlags[index];
          }
        }, stepTime);
      }, 300); // 분석 결과 반환 후 약간의 지연 후 진행률 증가 시작
    } catch (err) {
      // --- 분석 실패 처리 ---
      if (err.response) {
        // 서버 응답이 있는 경우 상태 코드 및 메시지 출력
        console.error("분석 실패:", err.response.status, err.response.data);
      } else {
        // 네트워크 오류 등 기타 오류 메시지 출력
        console.error("분석 실패:", err.message);
      }
      // 실패 알림 표시 (토스트)
      showToast(`${updatedFiles[index].name} 분석 실패`, "error", index);

      // 진행률 맵에서 해당 인덱스 삭제하여 진행률 초기화
      setProgressMap((prev) => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });
    }
  }, 1000);

  // 타이머 관리 객체 초기화 및 현재 인덱스 타이머 저장
  if (!handleAnalyzeFile.analysisTimers) {
    handleAnalyzeFile.analysisTimers = {};
  }
  handleAnalyzeFile.analysisTimers[index] = { timeoutId, intervalId };
}
// ✅ 프로그레스 바 관련 렌더링 정보 제공 함수
export function getProgressBarInfo(status, progress) {
  if (status === "done") {
    return {
      label: "분석 완료",
      labelColor: "text-green-600",
      barColor: "bg-green-400",
    };
  } else if (status === "processing") {
    return {
      label: "분석 중...",
      labelColor: "text-yellow-600",
      barColor: "bg-yellow-400",
    };
  } else {
    return {
      label: `${progress ?? 0}%`,
      labelColor: "text-gray-500",
      barColor: "bg-gray-200",
    };
  }
}