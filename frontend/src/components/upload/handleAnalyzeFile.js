import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function handleAnalyzeFile(
  index,
  fileList,
  setFileList,
  setProgressMap,
  showToast,
  updateProgress,
  updateToastStatus,
  onFileSelect
) {
  console.log("📦 현재 document.cookie:", document.cookie);
  const updatedFiles = [...fileList];
  const currentStatus = updatedFiles[index].status;

  if (currentStatus === "processing") {
    clearTimeout(handleAnalyzeFile.analysisTimers?.[index]?.timeoutId);
    clearInterval(handleAnalyzeFile.analysisTimers?.[index]?.intervalId);
    updatedFiles[index].status = "pending";
    setFileList(updatedFiles);
    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    setProgressMap((prev) => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });
    return;
  }

  updatedFiles[index].status = "processing";
  setFileList(updatedFiles);
  sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
  setProgressMap((prev) => ({ ...prev, [index]: 0 }));
  showToast(`${updatedFiles[index].name}`, "processing", index);

  const intervalId = setInterval(() => {
    setProgressMap((prev) => {
      const current = prev[index] || 0;
      if (current >= 100) {
        clearInterval(intervalId);
        return prev;
      }
      updateProgress(index, current + 5);
      return { ...prev, [index]: current + 5 };
    });
  }, 100);

  const timeoutId = setTimeout(async () => {
    updatedFiles[index].status = "done";
    setFileList([...updatedFiles]);
    sessionStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    clearInterval(intervalId);
    if (handleAnalyzeFile.analysisTimers) {
      delete handleAnalyzeFile.analysisTimers[index];
    }
    setProgressMap((prev) => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });

    const formData = new FormData();
    const realFile = updatedFiles[index].file instanceof File
      ? updatedFiles[index].file
      : new File([], updatedFiles[index].name);
    formData.append("file", realFile);

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
      const token = localStorage.getItem("access_token");

      const res = await axios.post(`${API_BASE}/analyze-full`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })  // 로그인 시 토큰 자동 포함
        },
        withCredentials: true  // client_uuid 쿠키 포함
      });

      console.log("분석 결과:", res.data);
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
    } catch (err) {
      if (err.response) {
        console.error("분석 실패:", err.response.status, err.response.data);
      } else {
        console.error("분석 실패:", err.message);
      }
      showToast(`${updatedFiles[index].name} 분석 실패`, "error", index);
    }
  }, 2000);

  if (!handleAnalyzeFile.analysisTimers) {
    handleAnalyzeFile.analysisTimers = {};
  }
  handleAnalyzeFile.analysisTimers[index] = { timeoutId, intervalId };
}