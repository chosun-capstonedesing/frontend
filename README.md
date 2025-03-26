# 🛡️ Web - Frontend
AI 기반 악성코드 탐지 시스템의 프론트엔드 웹 페이지입니다.    
파일 업로드, CNN 기반 분석 결과 시각화, 모델 성능 확인 등의 기능을 제공할 예정입니다.   



---



## 🌐 배포 주소
👉 [배포된 웹 페이지 바로가기](https://web-front-test.netlify.app/)    

> 🔐 웹 개발 확인을 위한 테스트용 배포로, 정식 배포가 아닙니다.   
검색 차단 설정(`robots.txt`, `<meta name="robots">`) 이 적용되어 검색 엔진에는 노출되지 않으며, 팀원들에게만 공유되는 내부 배포 페이지입니다.



---



## 🛠️ 사용 기술 스택

<div align="center">

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />

</div>



---



## 📂 프로젝트 구조
```
frontend/
├── public/
│   ├── robots.txt              # 배포 -> 검색 차단
│   └── vite.svg                # 웹 상단 아이콘 -> 변경 예정
├── src/
│   ├── components/             # UI 기능 단위 컴포넌트들
│   │   ├── DragAndDrop.jsx
│   │   ├── FileInfoDisplay.jsx
│   │   ├── FileInput.jsx
│   │   ├── FileUpload.jsx
│   │   ├── FileUploadView.jsx
│   │   ├── GuideSection.jsx
│   │   ├── Layout.jsx
│   │   ├── PerformanceSection.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TabNavigation.jsx
│   │   └── UtilityBar.jsx
│   ├── App.css                 # App 전용 스타일
│   ├── App.jsx                 # 메인 앱 컴포넌트
│   ├── index.css               # 전역 스타일 (Tailwind 포함)
│   └── main.jsx                # React 진입점
├── .gitignore
├── eslint.config.js
├── index.html                  # 전역 html
├── package-lock.json           
├── package.json                # 프로젝트 메타 정보 및 스크립트
├── postcss.config.js
├── README.md
├── tailwind.config.js          # Tailwind 설정
└── vite.config.js              # Vite 설정
```



---



