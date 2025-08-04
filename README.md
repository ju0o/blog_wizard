# Blog Wizard - PC용 블로거 워크스페이스

## 📖 개요

Blog Wizard는 PC에서 혼자 쓰는 블로그 글 작성, 포맷 변환, 히스토리 관리, 썸네일/카테고리/태그 등 실전 블로거용 에디터입니다.

### ✨ 주요 기능

- **리치 텍스트 에디터**: React Quill 기반의 강력한 글쓰기 도구
- **플랫폼별 포맷 변환**: 티스토리, 네이버 블로그, 마크다운 형식 지원
- **히스토리 관리**: 임시저장/발행글 복원, 삭제 기능
- **썸네일 업로드**: 이미지 미리보기 및 관리
- **카테고리/태그**: 수동 키워드 추천 및 관리
- **단축키 지원**: 저장(Ctrl+S), 발행(Ctrl+Enter), 새 글(Ctrl+N)
- **자동 저장**: 설정 가능한 자동 저장 기능
- **파일 내보내기/가져오기**: JSON 형식으로 데이터 백업/복원

### 🔒 보안 및 개인정보

- **모든 데이터는 로컬 PC에만 저장**
- **AI API/외부 서버 연동 없음**
- **키워드 추천은 수동만 지원**
- **개인정보는 절대 외부로 전송되지 않음**

## 🚀 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 1. 프로젝트 클론

```bash
git clone [이 프로젝트]
cd blog-wizard
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 모드 실행

```bash
# 개발 서버 시작 (Vite + Electron)
npm run dev

# 또는 개별 실행
npm run dev:renderer  # React 개발 서버
npm start             # Electron 앱
```

### 4. 프로덕션 빌드

```bash
# React 앱 빌드
npm run build

# Electron 앱 패키징
npm run package

# 실행 파일 생성 (.exe, .dmg, .deb 등)
npm run make
```

## 📁 프로젝트 구조

```
blog-wizard/
├── src/
│   ├── main/                 # Electron 메인 프로세스
│   │   └── index.js         # 앱 진입점, 윈도우 관리
│   ├── renderer/            # React 렌더러 프로세스
│   │   ├── src/
│   │   │   ├── components/  # 공용 UI 컴포넌트
│   │   │   │   └── ui/     # Button, Input, Textarea 등
│   │   │   ├── features/   # 주요 기능별 모듈
│   │   │   │   ├── editor/ # 글쓰기/리치에디터
│   │   │   │   ├── history/# 히스토리/임시저장 관리
│   │   │   │   └── formatter/# 포맷 변환
│   │   │   ├── types/      # TypeScript 타입 정의
│   │   │   ├── utils/      # 유틸리티 함수
│   │   │   │   ├── index.ts# 공통 유틸리티
│   │   │   │   ├── formatters.ts # 포맷 변환
│   │   │   │   └── cn.ts   # className 유틸리티
│   │   │   ├── App.tsx     # 메인 앱 컴포넌트
│   │   │   ├── main.tsx    # React 진입점
│   │   │   └── index.css   # Tailwind CSS
│   │   └── index.html      # HTML 템플릿
│   └── preload.ts          # Electron-Renderer 통신
├── package.json            # 프로젝트 설정
├── vite.config.ts         # Vite 설정
├── tailwind.config.js     # Tailwind CSS 설정
├── tsconfig.json          # TypeScript 설정
└── forge.config.js        # Electron Forge 설정
```

## 🛠️ 주요 파일 설명

### 메인 프로세스 (`src/main/index.js`)
- Electron 앱의 메인 프로세스
- 윈도우 생성 및 관리
- 메뉴 설정 (단축키 포함)
- IPC 핸들러 (파일 저장/로드)

### 렌더러 프로세스 (`src/renderer/src/`)
- **App.tsx**: 전체 앱 레이아웃 및 상태 관리
- **Editor.tsx**: 리치 텍스트 에디터 (React Quill)
- **History.tsx**: 히스토리 관리 컴포넌트
- **Formatter.tsx**: 플랫폼별 포맷 변환

### 타입 정의 (`src/renderer/src/types/index.ts`)
- BlogPost: 블로그 포스트 타입
- HistoryItem: 히스토리 항목 타입
- AppSettings: 앱 설정 타입
- PlatformConfig: 플랫폼별 설정 타입

### 유틸리티 (`src/renderer/src/utils/`)
- **index.ts**: 공통 유틸리티 함수
- **formatters.ts**: 티스토리/네이버 포맷 변환
- **cn.ts**: className 병합 유틸리티

## 🎯 사용법

### 1. 글쓰기
1. "글쓰기" 탭에서 새 글 작성
2. 제목, 카테고리, 태그 입력
3. 리치 텍스트 에디터로 내용 작성
4. Ctrl+S로 저장, Ctrl+Enter로 발행

### 2. 히스토리 관리
1. "히스토리" 탭에서 저장된 글 확인
2. 임시저장/발행글 필터링
3. 복원, 삭제, 미리보기 기능 사용

### 3. 포맷 변환
1. "포맷 변환" 탭에서 플랫폼 선택
2. 플랫폼별 설정 입력 (티스토리 토큰 등)
3. 변환 버튼으로 포맷 변환
4. 복사/다운로드로 결과 활용

### 4. 파일 관리
- **내보내기**: 현재 데이터를 JSON 파일로 저장
- **가져오기**: JSON 파일에서 데이터 복원

## ⚙️ 환경 설정

### 플랫폼별 설정

#### 티스토리
```json
{
  "accessToken": "여기에_티스토리_액세스_토큰",
  "blogName": "여기에_블로그명",
  "categoryId": "선택사항_카테고리ID"
}
```

#### 네이버 블로그
```json
{
  "clientId": "여기에_네이버_클라이언트ID",
  "clientSecret": "여기에_네이버_클라이언트시크릿",
  "blogId": "여기에_블로그ID"
}
```

### 단축키
- **Ctrl+S**: 저장
- **Ctrl+Enter**: 발행
- **Ctrl+N**: 새 글
- **Ctrl+Q**: 앱 종료

## 🔧 개발 가이드

### 새 기능 추가
1. `src/renderer/src/features/` 폴더에 새 모듈 생성
2. 타입 정의는 `src/renderer/src/types/`에 추가
3. 유틸리티는 `src/renderer/src/utils/`에 추가
4. UI 컴포넌트는 `src/renderer/src/components/`에 추가

### 스타일링
- Tailwind CSS 사용
- `src/renderer/src/index.css`에서 커스텀 스타일 추가
- `tailwind.config.js`에서 테마 확장

### 빌드 및 배포
```bash
# 개발 빌드
npm run build

# Electron 패키징
npm run package

# 실행 파일 생성
npm run make
```

## 🐛 문제 해결

### 일반적인 문제

1. **의존성 설치 실패**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **빌드 오류**
   ```bash
   npm run type-check  # TypeScript 오류 확인
   npm run lint        # ESLint 오류 확인
   ```

3. **Electron 앱이 실행되지 않음**
   ```bash
   npm run dev:renderer  # React 서버 먼저 실행
   npm start             # Electron 앱 실행
   ```

### 개발 도구

- **TypeScript**: 타입 체크 `npm run type-check`
- **ESLint**: 코드 검사 `npm run lint`
- **Vite**: 빠른 개발 서버
- **Electron Forge**: 패키징 및 배포

## 📋 TODO 리스트

### 구현 예정 기능
- [ ] 설정 페이지 (테마, 자동저장 간격 등)
- [ ] 썸네일 업로드 기능
- [ ] 카테고리/태그 관리 페이지
- [ ] 키워드 추천 시스템 (수동)
- [ ] 다크 모드 지원
- [ ] 미리보기 모달
- [ ] 플러그인 시스템

### 개선 사항
- [ ] 성능 최적화
- [ ] 에러 처리 강화
- [ ] 사용자 가이드 추가
- [ ] 단위 테스트 추가
- [ ] E2E 테스트 추가

## 🎉 완성된 기능

### ✅ 구현 완료
- [x] Electron + React + TypeScript 기반 앱 구조
- [x] 리치 텍스트 에디터 (React Quill)
- [x] 히스토리 관리 (임시저장/발행글)
- [x] 플랫폼별 포맷 변환 (티스토리/네이버/마크다운)
- [x] 단축키 지원 (Ctrl+S, Ctrl+Enter, Ctrl+N)
- [x] 자동 저장 기능
- [x] 파일 내보내기/가져오기
- [x] 태그 관리 시스템
- [x] 카테고리 관리
- [x] 썸네일 URL 입력
- [x] 모던 UI (Tailwind CSS)
- [x] TypeScript 타입 안전성
- [x] ESLint 코드 품질 관리
- [x] Vite 빌드 시스템
- [x] Electron Forge 패키징

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 기능 요청이 있으시면 이슈를 생성해주세요.

---

**Blog Wizard** - PC에서 쓰는 블로거의 완벽한 워크스페이스 🚀

## 🚀 빠른 시작

```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd blog-wizard

# 2. 의존성 설치
npm install

# 3. 개발 모드 실행
npm run dev

# 4. 빌드 (선택사항)
npm run build
npm run make
```

**즉시 사용 가능한 기능:**
- ✍️ 리치 텍스트 에디터로 글쓰기
- 📝 자동 저장 및 히스토리 관리
- 🔄 플랫폼별 포맷 변환
- ⌨️ 단축키 지원
- 💾 파일 백업/복원