import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaChartPie, FaClipboardList, FaQrcode, FaUser, FaInfoCircle } from "react-icons/fa";

const Sidebar = ({ onNavigate }) => {
  const menuItems = [
    { icon: <FaHome />, label: "파일 분석", path: "/" },
    { icon: <FaClipboardList />, label: "분석 결과", path: "/analysis_results" },
    { icon: <FaChartPie />, label: "모델 정보", path: "/performance" },
    { icon: <FaUser />, label: "MyPage", path: "/mypage" },
    { icon: <FaInfoCircle />, label: "서비스 정보", path: "/guide" },
  ];

  return (
    <aside className="w-64 min-h-full bg-white border-r border-gray-200 rounded-2xl shadow-xl px-5 py-6">
      <div className="flex items-center gap-3 mb-8">
        <img src="/CSEC.PNG" alt="로고" className="w-9 h-9 object-contain" />
        <h1 className="text-xl font-extrabold text-gray-900">CSEC</h1>
      </div>
      <nav className="flex flex-col gap-7 text-[18px] font-semibold text-gray-400">
        {menuItems.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-2 rounded-2xl transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'hover:bg-blue-100 text-gray-600'
              }`
            }
          >
            <span className="text-[18px]">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;