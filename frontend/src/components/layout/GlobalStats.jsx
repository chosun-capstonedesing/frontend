import React, { useEffect, useState, useRef } from "react";
import { FaLink, FaFileAlt, FaChartBar } from "react-icons/fa";
import CountUp from "react-countup";

//const VirusTotal_API_KEY = import.meta.env.VITE_VirusTotal_API_KEY;

const StatCard = ({ icon, label, count, color }) => (
  <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-lg text-center">
    <div className={`text-2xl ${color}`}>{icon}</div>
    <div className="text-sm text-gray-500 mt-2">{label}</div>
    <div className="text-3xl font-bold text-gray-800 mt-1">
      <CountUp end={count} duration={1.5} separator="," />
    </div>
  </div>
);

export default function GlobalStats() {
  const data = [
    { icon: <FaLink />, label: "세계 실시간 URL 분석 수", count: 890, color: "text-blue-500", barColor: "bg-blue-400", width: "60%" },
    { icon: <FaFileAlt />, label: "세계 실시간 파일 분석 수", count: 1380, color: "text-green-500", barColor: "bg-green-400", width: "83.33%" },
    { icon: <FaChartBar />, label: "세계 실시간 총 분석 수", count: 2270, color: "text-purple-500", barColor: "bg-purple-400", width: "100%" },
  ];

  const [animatedWidths, setAnimatedWidths] = useState(
    data.map(() => "0%")
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedWidths(data.map(item => item.width));
    }, 100); // small delay to trigger transition

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-4 sticky top-24 transition-all delay-200 duration-500">
      {data.map(({ icon, label, count, color, barColor }, idx) => {
        const ref = useRef(null);
        const [visible, setVisible] = useState(false);

        useEffect(() => {
          const observer = new window.IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.5 }
          );
          if (ref.current) observer.observe(ref.current);
          return () => {
            if (ref.current) observer.unobserve(ref.current);
          };
        }, []);

        return (
          <div
            key={idx}
            ref={ref}
            className={`transform transition-all duration-700 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } flex flex-col items-center justify-center bg-white px-10 py-7 rounded-2xl shadow-lg text-center`}
          >
            <div className={`text-2xl ${color}`}>{icon}</div>
            <div className="text-sm text-gray-500 mt-2">{label}</div>
            <div className="text-3xl font-bold text-gray-800 mt-1">
              <CountUp end={count} duration={1.5} separator="," />
            </div>
            <div className="mt-3 w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                style={{ width: animatedWidths[idx] }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}