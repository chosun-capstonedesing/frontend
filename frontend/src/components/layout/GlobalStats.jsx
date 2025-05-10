import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

const VirusTotal_API_KEY = import.meta.env.VITE_VirusTotal_API_KEY;

const GlobalStats = () => {
    const [urlCount, setUrlCount] = useState(null);
    const [fileCount, setFileCount] = useState(null);

    useEffect(() => {
        // ✅ 개발 중 임시 값 사용
        setUrlCount(873);
        setFileCount(1274);

        /*
        // 🔄 TODO: 백엔드 연동 시 사용
        const fetchPopularUrls = async () => {
            try {
                const res = await fetch("https://www.virustotal.com/api/v3/intelligence/popular_urls", {
                    headers: { "x-apikey": VirusTotal_API_KEY, },
                });

                const data = await res.json();
                setUrlCount(data.data?.length || 0);
            } catch (err) {
                console.error("URL fetch error: ", err);
                setUrlCount(0);
            }
        };

        const fetchPopularFiles = async () => {
            try {
                const res = await fetch("https://www.virustotal.com/api/v3/intelligence/popular_files", {
                    headers: { "x-apikey": VirusTotal_API_KEY, },
                });

                const data = await res.json();
                setFileCount(data.data?.length || 0);
            } catch (err) {
                console.error("File fetch error: ", err);
                setFileCount(0);
            }
        };

        fetchPopularUrls();
        fetchPopularFiles();
        */
    }, []);


    return (
        <div className='bg-blue-700 text-white text-center py-10 rounded-xl shadow-md mb-10'>
            <h2 className='text-2xl font-bold mb-6'>🌐 전세계 실시간 보안 통계</h2>

            <div className="flex flex-col sm:flex-row justify-center gap-10 text-3xl font-mono">
                <div>
                    <p className="text-white text-sm mb-1">🔥 인기 URL 분석 수</p>
                    {urlCount !== null ? (<CountUp end={urlCount} duration={2} separator=","/>):(<span className="animate-pulse">로딩중...</span>)}
                </div>

                <div>
                    <p className="text-white text-sm mb-1">📁 인기 파일 분석 수</p>
                    {fileCount !== null ? (<CountUp end={fileCount} duration={2} separator=","/>):(<span className="animate-pulse">로딩중...</span>)}
                </div>
            </div>
        </div>
    );
};

export default GlobalStats;