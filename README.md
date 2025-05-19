# 🛡️ Web - Frontend
AI 기반 악성코드 탐지 시스템의 프론트엔드 웹 페이지입니다.    
파일 업로드, CNN 기반 분석 결과 시각화, 모델 성능 확인 등의 기능을 제공할 예정입니다.   

<br/>

## 🌐 배포 주소
👉 [배포된 웹 페이지 바로가기](https://web-front-test.netlify.app/)    

> 🔐 웹 개발 확인을 위한 테스트용 배포로, 정식 배포가 아닙니다.   
검색 차단 설정(`robots.txt`, `<meta name="robots">`) 이 적용되어 검색 엔진에는 노출되지 않으며, 팀원들에게만 공유되는 내부 배포 페이지입니다.


<br/>

---

## 🛠️ 사용 기술 스택

<div align="center">

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />

</div>


<br/>

---

## # 📁 frontend 디렉토리 구조 (기능 기반 + 역할 분리)
```
frontend/
├── public/
│   ├── robots.txt            # 검색 엔진 접근 차단 설정
│   └── CSEC.PNG              # 서비스 로고
│
├── src/
│   ├── App.css
│   ├── App.jsx                      # Router 및 전역 레이아웃 연결
│   ├── index.css                    # 글로벌 스타일
│   ├── main.jsx                     # React DOM 진입점
│ 
│   ├── features/             # 주요 기능별 페이지 및 컴포넌트
│   │   ├── auth/             # 🔐 로그인 및 인증 관련
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.jsx         # 로그인 페이지 UI
│   │   │   └── components/
│   │   │       ├── AuthForm.jsx         # 로그인 폼 컴포넌트
│   │   │       └── LogoutButton.jsx     # 로그아웃 버튼
│   │   │
│   │   ├── analysis/         # 📁 파일 업로드 및 분석 결과
│   │   │   ├── pages/
│   │   │   │   ├── AnalysisPage.jsx       # 분석 요청 페이지
│   │   │   │   └── AnalysisResults.jsx    # 분석 결과 시각화 페이지
│   │   │   └── components/
│   │   │       ├── FileUploadView.jsx    # 분석 중 상태 출력
│   │   │       ├── handleAnalyzeFile.js  # 분석 요청 처리 함수
│   │   │       ├── DragAndDrop.jsx       # 드래그앤드롭 업로더
│   │   │       ├── FileInput.jsx         # 파일 선택 input
│   │   │       ├── FileUpload.jsx        # 파일 업로드 버튼
│   │   │       ├── ProgressBar.jsx       # 분석 진행률 바
│   │   │       ├── useUploadLimit.js     # 업로드 제한 훅
│   │   │       └── useUploadSession.js   # 세션 업로드 추적 훅
│   │   │
│   │   ├── mypage/           # 🙍‍♀️ 사용자 파일 분석 이력 조회
│   │   │   ├── pages/
│   │   │   │   ├── MyPage.jsx           # 마이페이지 메인
│   │   │   │   └── MyPageDetail.jsx     # 분석 상세 정보 페이지
│   │   │
│   │   ├── search/           # 🔍 QR 및 URL 검색 기능
│   │   │   ├── pages/
│   │   │   │   └── QRSearchPage.jsx     # QR 검색 메인 페이지
│   │   │   └── components/
│   │   │       ├── QRScanner.jsx        # 카메라 스캔 기능
│   │   │       ├── QRSearchBlock.jsx    # QR 검색 블록 UI
│   │   │       ├── QRUploader.jsx       # QR 이미지 업로더
│   │   │       └── URLSearchForm.jsx    # URL 직접 입력 폼
│   │   │
│   │   ├── guide/            # 📘 사용자 가이드
│   │   │   └── pages/
│   │   │       └── GuideSection.jsx     # 가이드 콘텐츠
│   │   │
│   │   └── performance/      # 📊 모델 성능 소개 페이지
│   │       └── pages/
│   │           └── PerformanceSection.jsx   # 정밀도/재현율 표 시각화
│
│   ├── components/
│   │   └── layout/           # 💠 전체 레이아웃 및 공통 UI
│   │       ├── Layout.jsx           # 전체 페이지 기본 레이아웃
│   │       ├── Sidebar.jsx          # 사이드 메뉴
│   │       └── GlobalStats.jsx      # 전역 분석 통계 표시
│
│   ├── shared/              # 🔁 공통 유틸, API, 컨텍스트, 훅
│   │   ├── api/
│   │   │   └── auth.js                 # 로그인/회원정보 관련 API 호출
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # 로그인 상태 관리
│   │   │   └── ToastContext.jsx       # 알림 컨텍스트
│   │   ├── hooks/                     # 프로젝트 전역 재사용 훅
│   │   └── utils/
│   │       └── isLoggedIn.js          # 로그인 여부 확인 유틸
│
├── test/                     # 🧪 유닛 테스트 코드
│   ├── analyzeFull.test.js
│   ├── auth.test.js
│   ├── index.js
│   └── remaining.test.js
│
├── .env                      # 환경 변수 설정
├── eslint.config.js          # ESLint 코드 규칙
├── index.html                # HTML 템플릿
├── log-server.js             # 개발 중 로그 수집 서버
├── netlify.toml              # Netlify 배포 설정
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js            # Vite 번들 설정
```

<br/>