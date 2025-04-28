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

## 📂 프로젝트 구조
```
frontend/
├── public/
│   ├── robots.txt                      # 배포 -> 검색 차단 설정
│   └── CSEC.PNG                        # 도메인 로고
├── src/
│   ├── components/
│   │   ├── auth/                       # 🔐 인증 관련 컴포넌트
│   │   │   ├── AuthFrom.jsx
│   │   │   └── LogoutButton.jsx
│   │   ├── layout/                     # 🧩 레이아웃 및 공통 UI
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── search/                     # 🔍 검색 기능 (URL, QR 등)
│   │   │   ├── QRScanner.jsx
│   │   │   ├── QRSearchBlock.jsx
│   │   │   ├── QRUploader.jsx
│   │   │   └── URLSearchForm.jsx 
│   │   ├── upload/                     # 📁 파일 업로드 UI
│   │   │   ├── DragAndDrop.jsx
│   │   │   ├── FileinfoDisplay.jsx
│   │   │   ├── FileInput.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── FileUploadView.jsx
│   │   │   └── ProgressBar.jsx
│   ├── routes/                         # 🗂️ 페이지 라우팅 단위
│   │   ├── AnalysisPage.jsx
│   │   ├── GuideSection.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MainLayout.jsx
│   │   ├── MyPage.jsx
│   │   ├── MyPageDetail.jsx
│   │   ├── PerformanceSection.jsx.jsx
│   │   └── QRSearchPage.jsx
│   ├── utils/                         # ⛓️‍💥 로그인 상태 확인 함수
│   │   └── isLoggedIn.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```


<br/>