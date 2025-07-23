# 프로젝트 소개

이 프로젝트는 React, Vite, TailwindCSS, 그리고 shadcn/ui 디자인 시스템을 기반으로 개발됩니다.

## 사용 라이브러리

- [React (19.1.0)](https://ko.react.dev/)
- [react-router (7.7.0)](https://reactrouter.com/start/data/custom)
- [tailwindcss (4.1.11)](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [axios (1.11.0)](https://axios-http.com/kr/docs/intro)
- [react-query (5.83.0)](https://tanstack.com/query/latest/docs/framework/react/overview)
- [zustand (5.0.6)](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [react-hook-form (7.60.0)](https://react-hook-form.com/)
- [zod (4.0.5)](https://zod.dev/)

> 개발 중 라이브러리가 추가될 때마다 이 목록에 계속 추가할 예정입니다.

## 폴더 구조

```
src/
├── assets/         # 이미지, 폰트, 정적 파일 등
├── components/     # 재사용 가능한 컴포넌트
├── pages/          # 라우트(페이지) 단위 컴포넌트
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── types/          # 공통 타입 정의(TypeScript 인터페이스, 타입 등)
├── constants/      # 프로젝트 전역에서 사용하는 상수 값 정의
├── routers/        # 라우팅 관련 설정 및 라우터 정의
├── App.tsx          # 전체 앱의 뼈대
├── main.tsx        # 진입점(엔트리포인트)
└── global.css      # 전역 스타일
```

- **assets/**: 이미지, 아이콘, 폰트 등 정적 파일 보관
- **components/**: 여러 페이지에서 재사용할 수 있는 UI 컴포넌트
  - **components/shared/**: 공통 컴포넌트 중에서도 가장 자주 사용되는, 가장 작은 단위의 컴포넌트 집합 (예: Button, Input, Checkbox 등)
- **pages/**: 라우터에서 사용하는 각 페이지별 컴포넌트 (예: Home.jsx, About.jsx 등)
- **hooks/**: 직접 만든 커스텀 훅(useXXX)
- **utils/**: 여러 곳에서 쓸 수 있는 함수들
- **types/**: 프로젝트 전역에서 사용하는 TypeScript 타입, 인터페이스 등 공통 타입 정의
- **constants/**: 프로젝트 전역에서 사용하는 상수 값(예: 페이지 진입 경로, 공통 메시지 등)을 정의
- **routers/**: 라우팅 관련 설정 및 라우터 컴포넌트, 라우트 맵 등을 정의
- **App.tsx**: 전체 앱의 뼈대 역할을 하는 컴포넌트로, 라우팅, 레이아웃, 글로벌 상태 관리 등 핵심 구조를 담당
- **main.jsx**: 앱의 진입점
- **index.css**: TailwindCSS 등 전역 스타일

## 디자인 시스템

- 본 프로젝트는 [shadcn/ui](https://ui.shadcn.com/) 디자인 시스템을 채택하여 UI 컴포넌트를 개발합니다.

## Docker로 개발 환경 실행하기

이 프로젝트는 Docker와 docker-compose를 이용해 손쉽게 개발 환경을 구축할 수 있습니다.

### 1. 컨테이너 실행 방법

아래 명령어로 개발 서버를 실행할 수 있습니다.

```bash
docker-compose up
```

- 위 명령어를 실행하면, Vite 개발 서버가 컨테이너에서 자동으로 실행됩니다.
- 브라우저에서 [http://localhost:5173](http://localhost:5173) 으로 접속하면 프론트엔드 개발 환경을 확인할 수 있습니다.

### 2. 컨테이너 중지 및 삭제

```bash
docker-compose down
```

### 3. 새로운 라이브러리 설치 시 주의사항

새로운 라이브러리(pnpm add 등)를 설치한 경우, 반드시 이미지를 다시 빌드해야 합니다.

```bash
docker-compose build
```

#### 왜 이미지를 다시 빌드해야 하나요?

- Docker 이미지는 `package.json`과 `pnpm-lock.yaml` 파일을 기준으로 의존성 패키지를 설치합니다.
- 새로운 라이브러리를 추가하면, 이 파일들이 변경되지만 기존 컨테이너/이미지에는 반영되지 않습니다.
- 이미지를 다시 빌드하지 않으면, 컨테이너 내부에는 새로 추가한 라이브러리가 설치되지 않아 실행 시 오류가 발생할 수 있습니다.
- 따라서 **새로운 라이브러리를 설치하거나 package.json, pnpm-lock.yaml이 변경된 경우 반드시 아래 명령어로 이미지를 다시 빌드**해야 합니다.

```bash
docker-compose build
```

그 후, 컨테이너를 재시작하세요.

```bash
docker-compose up
```

#### .dockerignore에 node_modules를 추가하는 이유

Docker 환경에서 `node_modules` 디렉토리를 `.dockerignore`에 반드시 추가해야 하는 이유는 다음과 같습니다.

1. **호스트와 컨테이너의 환경 차이로 인한 문제 방지**

   - 로컬(호스트)에서 생성된 node_modules는 운영체제(Windows, macOS, Linux)마다 파일 권한, 심볼릭 링크, 바이너리 등에서 차이가 있습니다.
   - 이 디렉토리를 Docker 이미지에 복사하면, 컨테이너(Linux 환경)에서 제대로 동작하지 않거나, 파일 권한 오류(예: archive/tar: unknown file mode) 등이 발생할 수 있습니다.

2. **이미지 용량 최적화**

   - node_modules는 용량이 매우 크고, 불필요하게 이미지를 비대하게 만듭니다.
   - 어차피 Dockerfile에서 `pnpm install`을 통해 컨테이너 내부에서 새롭게 의존성을 설치하므로, 호스트의 node_modules를 복사할 필요가 없습니다.

3. **의존성 일관성 유지**

   - Docker 이미지는 항상 `package.json`과 `pnpm-lock.yaml`을 기준으로 의존성을 설치합니다.
   - 만약 호스트의 node_modules가 복사되면, lock 파일과 실제 설치된 패키지 버전이 다를 수 있어 예기치 않은 버그가 발생할 수 있습니다.

4. **빌드 속도 향상**
   - node_modules를 복사하지 않으면, Docker 빌드 시 불필요한 파일 복사 시간이 줄어들어 빌드가 더 빨라집니다.

따라서 `.dockerignore` 파일에 반드시 `node_modules`를 추가하여 위와 같은 문제를 예방해야 합니다.

---
