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

  // 파일 리스트 복사본 생성
  const updatedFiles = [...fileList];
  const currentStatus = updatedFiles[index].status;

  // --- 분석 중지 처리 ---
  if (currentStatus === "processing") {
    // 이전에 설정된 타이머 및 인터벌을 클리어하여 분석 중지
    clearTimeout(handleAnalyzeFile.analysisTimers?.[index]?.timeoutId);
    clearInterval(handleAnalyzeFile.analysisTimers?.[index]?.intervalId);
    clearInterval(handleAnalyzeFile.analysisTimers?.[index]?.barIntervalId);

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
  // Prevent re-triggering analysis if result already exists
  const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
  const storedFile = storedFiles.find((f) => f.name === updatedFiles[index].name);
  if (storedFile && storedFile.result) {
    updatedFiles[index].status = "done";
    setFileList(updatedFiles);
    return; // 이미 완료된 분석은 다시 요청하지 않음
  }

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

  // --- 수정된 진행률 업데이트 및 분석 요청 처리 ---
  const barStepTime = 50;
  const numberStepTime = 100;
  const totalDuration = 17000;
  const totalSteps = totalDuration / numberStepTime;
  const stepAmount = 100 / totalSteps;

  let progressValue = 0;
  let isResultReceived = false;
  let resultData = null;

  // 바 애니메이션 (더 부드럽고 빠르게)
  const barIntervalId = setInterval(() => {
    progressValue = Math.min(progressValue + stepAmount * (barStepTime / numberStepTime), 100);
    setProgressMap((prev) => ({ ...prev, [index]: Math.floor(progressValue) }));
  }, barStepTime);

  // 퍼센트 숫자 업데이트
  const numberIntervalId = setInterval(() => {
    updateProgress(index, Math.floor(progressValue));
    if (progressValue >= 100 && isResultReceived) {
      clearInterval(barIntervalId);
      clearInterval(numberIntervalId);

      updatedFiles[index].status = "done";
      setFileList([...updatedFiles]);
      updateLocalStorageResult(updatedFiles[index].name, resultData);

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
  }, numberStepTime);

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

  // 분석 요청 즉시 시작
  (async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      const realFile = updatedFiles[index].file instanceof File
        ? updatedFiles[index].file
        : new File([], updatedFiles[index].name);
      formData.append("file", realFile);

      // Extract client_uuid from cookies and append to formData if present
      const clientUuid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("client_uuid="))
        ?.split("=")[1];

      // ✅ UUID는 access_token이 없는 경우에만 전송 (비로그인 사용자용)
      if (!token && clientUuid) {
        formData.append("uuid", clientUuid);
      }

      const res = await axios.post(`/api/analyze-full`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...(import.meta.env.DEV && { 'X-Dev-Bypass': 'true' })
        },
        withCredentials: true
      });

      console.log("분석 결과:", res.data);

      if (handleAnalyzeFile.canceledFlags[index]) {
        console.log("❌ 분석이 중단된 파일입니다. 결과 무시됨:", index);
        clearInterval(barIntervalId);
        clearInterval(numberIntervalId);
        return;
      }

      isResultReceived = true;
      resultData = res.data;

    } catch (err) {
      clearInterval(barIntervalId);
      clearInterval(numberIntervalId);
      if (err.response) {
        console.error("분석 실패:", err.response.status, err.response.data);
      } else {
        console.error("분석 실패:", err.message);
      }
      showToast(`${updatedFiles[index].name} 분석 실패`, "error", index);
      setProgressMap((prev) => {
        const newMap = { ...prev };
        delete newMap[index];
        return newMap;
      });
    }
  })();

  // 타이머 관리 객체 초기화 및 현재 인덱스 타이머 저장
  if (!handleAnalyzeFile.analysisTimers) {
    handleAnalyzeFile.analysisTimers = {};
  }
  handleAnalyzeFile.analysisTimers[index] = { intervalId: numberIntervalId, barIntervalId };
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