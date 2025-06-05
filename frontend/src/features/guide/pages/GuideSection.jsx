import React from "react";

/**
 * 사용자 가이드 및 설명 UI 컴포넌트
 * - 웹 동작 방식, 모델 설명 등 설명 추가
 */

function GuideSection() {
    return (
        <>
            <div className="lg:flex">
                <div className="w-full lg:w-2/3 pr-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">사용자 가이드 & 설명</h2>
                        <p className="text-lg leading-relaxed text-gray-800">
                          본 웹 서비스는 AI 기반의 머신러닝(ML) 기술을 활용하여<br/>
                          파일 분석 및 URL/QR 분석을 제공합니다.
                        </p>
                        <p className="mt-4 text-lg leading-relaxed text-gray-800">
                          • <strong>분석 결과</strong>에서는 사용자가 분석한 파일에 대한 탐지 결과를 확인할 수 있습니다.<br/>
                          • <strong>모델 정보</strong>에서는 분석 시 활용된 머신러닝 모델의 세부 정보를 볼 수 있습니다.<br/>
                          • <strong>마이페이지</strong>에서는 분석 기록을 기반으로 과거 분석 파일의 결과를 조회할 수 있습니다.<br/>
                          • 분석 결과 및 마이페이지에서는 <strong>결과 데이터를 PDF로 다운로드 받을 수 있습니다.</strong>
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-gray-500">
                          기술 스택, 팀 정보 외의 상세한 프로젝트 진행 정보는 팀 정보의 <strong>팀 GitHub</strong> 링크를 참고해주세요.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="mt-6">
                            <h1 className="text-2xl font-bold -mt-4 mb-4">사용 기술 스택</h1>

                            <h4 className="text-xl font-semibold mt-8 -mb-2">Backend</h4>
                            <div className="flex flex-wrap gap-10 justify-start">
                                {[
                                    { name: "FastAPI", icon: <img src="https://cdn.simpleicons.org/fastapi/009688" alt="FastAPI" className="w-10 h-10 rounded-sm" /> },
                                    { name: "Uvicorn", icon: <div className="text-4xl">🦄</div> },
                                    { name: "SQLAlchemy", icon: <img src="https://www.sqlalchemy.org/img/sqla_logo.png" alt="SQLAlchemy" className="w-32 h-20 object-contain" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-6 justify-start">
                                {[
                                    { name: "PostgreSQL", icon: <img src="https://cdn.simpleicons.org/postgresql/336791" alt="PostgreSQL" className="w-10 h-10 rounded-sm" /> },
                                    { name: "Docker", icon: <img src="https://cdn.simpleicons.org/docker/2496ED" alt="Docker" className="w-11 h-11 rounded-sm" /> },
                                    { name: "Python", icon: <img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" className="w-10 h-10 rounded-sm" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-10 justify-start mt-6">
                                {[
                                    { name: "AWS EC2", icon: <img src="https://cdn.simpleicons.org/amazonec2/FF9900" alt="AWS EC2" className="w-10 h-10 rounded-sm" /> },
                                    { name: "AWS RDS", icon: <img src="https://cdn.simpleicons.org/amazonrds/527FFF" alt="AWS RDS" className="w-10 h-10 rounded-sm" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 className="text-xl font-semibold mt-10 mb-3">Frontend</h4>
                            <div className="flex flex-wrap gap-14 justify-start">
                                {[
                                    { name: "React", icon: <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" className="w-10 h-10 rounded-sm" /> },
                                    { name: "Tailwind", icon: <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind" className="w-10 h-10 rounded-sm" /> },
                                    { name: "Vite", icon: <img src="https://cdn.simpleicons.org/vite/646CFF" alt="Vite" className="w-10 h-10 rounded-sm" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-14 mt-5 justify-start">
                                {[
                                    { name: "Axios", icon: <img src="/axios-logo.png" alt="Axios" className="w-10 h-10 rounded-sm" /> },
                                    { name: "JavaScript", icon: <img src="https://cdn.simpleicons.org/javascript/F7DF1E" alt="JavaScript" className="w-10 h-10 rounded-sm" /> },
                                    { name: "Netlify", icon: <img src="https://cdn.simpleicons.org/netlify/00C7B7" alt="Netlify" className="w-10 h-10 rounded-sm" /> }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 className="text-xl font-semibold mt-12 mb-3">ML(Machine Learning)</h4>
                            <div className="flex flex-wrap gap-14">
                                {[
                                    { name: "CNN", icon: <div className="text-4xl">🧠</div>, color: "bg-red-700" },
                                    { name: "Random Forest", icon: <div className="text-4xl">🌲</div>, color: "bg-green-700" },
                                    { name: "Python", icon: <img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" className="w-10 h-10 rounded-sm" />, color: "bg-yellow-600" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 text-sm">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-2xl shadow-xl p-6 mt-0 mb-6">
                        <div className="mt-2 mb-6">
                            <h3 className="text-2xl font-semibold mb-5 -mt-3">팀 정보</h3>
                            <a
                                href="https://github.com/chosun-capstonedesing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center bg-black hover:bg-gray-800 text-white font-semibold text-base py-3 px-4 rounded-full shadow-md w-full"
                            >
                                <img
                                    src="https://cdn.simpleicons.org/github/ffffff"
                                    alt="GitHub"
                                    className="w-6 h-6 mr-3"
                                />
                                CSEC Team GitHub
                            </a>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { name: "박준언", email: "pppp662667@gmail.com", role: "ML", position: "팀장", affiliation: "조선대학교 정보보안전공" },
                                { name: "김민서", email: "iminseo031224@gmail.com", role: "Frontend", position: "팀원", affiliation: "조선대학교 정보보안전공" },
                                { name: "김원준", email: "kimwonjun1429@gmail.com", role: "ML", position: "팀원", affiliation: "조선대학교 정보보안전공" },
                                { name: "윤혜준", email: "hj021313@gmail.com", role: "Backend", position: "팀원", affiliation: "조선대학교 정보보안전공" },
                                { name: "임창훈", email: "limch2320@chosun.ac.kr", role: "ML", position: "팀원", affiliation: "조선대학교 정보보안전공" },
                            ].map((member, index) => (
                                <div key={index} className="flex items-center bg-gray-50 p-4 rounded-2xl shadow-xl">
                                    <div className="flex-shrink-0 mr-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-gray-600">{member.email}</p>
                                        <p className="text-sm text-gray-600">{member.affiliation}</p>
                                        <span
                                          className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white rounded-full mr-1 ${
                                            member.role === "ML"
                                              ? "bg-blue-500"
                                              : member.role === "Frontend"
                                              ? "bg-purple-500"
                                              : member.role === "Backend"
                                              ? "bg-green-500"
                                              : "bg-gray-500"
                                          }`}
                                        >
                                          {member.role}
                                        </span>
                                        <span
                                          className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${
                                            member.position === "팀장"
                                              ? "bg-gray-800"
                                              : member.position === "팀원"
                                              ? "bg-gray-600"
                                              : "bg-gray-400"
                                          }`}
                                        >
                                          {member.position}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GuideSection;