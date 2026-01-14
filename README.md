# Weather App

한국 지역 기반의 날씨 정보 웹 애플리케이션입니다.

## 주요 기능

- **현재 위치 날씨** - GPS 기반 현재 위치의 날씨 정보 표시
- **지역 검색** - 한국 시/군/구/동 단위 지역 검색
- **시간대별 예보** - 24시간 동안의 시간별 날씨 예보
- **즐겨찾기** - 자주 확인하는 지역 저장 및 관리
  - 드래그 앤 드롭으로 순서 변경
  - 별칭 설정 가능
- **다크모드** - 라이트/다크 테마 전환

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| State Management | Zustand (클라이언트), TanStack Query v5 (서버) |
| API | Open-Meteo (날씨), Nominatim (지오코딩) |
| Architecture | Feature-Sliced Design (FSD) |

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 프로젝트 구조 (FSD Architecture)

```
src/
├── app/                    # Next.js App Router (pages, layouts)
│   ├── page.tsx           # 메인 페이지
│   ├── weather/[id]/      # 즐겨찾기 상세 페이지
│   └── providers/         # Provider 컴포넌트
├── features/              # 기능 단위 모듈
│   ├── weather/           # 날씨 API 및 쿼리
│   └── location-search/   # 지역 검색 기능
├── widgets/               # 독립적인 UI 블록
│   ├── weather-card/      # 날씨 카드
│   ├── hourly-forecast/   # 시간별 예보
│   └── favorite-grid/     # 즐겨찾기 그리드
├── entities/              # 비즈니스 엔티티
├── shared/                # 공유 리소스
│   ├── ui/               # 공통 UI 컴포넌트
│   ├── hooks/            # 공통 훅
│   ├── model/            # 전역 상태 (Zustand)
│   └── lib/              # 유틸리티
└── views/                 # 페이지 레벨 컴포넌트
```

## 상태 관리 흐름

```
┌─────────────────────────────────────────────────────────┐
│                     사용자 인터렉션                       │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    ┌───────────────┐               ┌───────────────┐
    │   Zustand     │               │ TanStack Query│
    │ (클라이언트)   │               │   (서버)      │
    ├───────────────┤               ├───────────────┤
    │ • 즐겨찾기    │               │ • 날씨 데이터 │
    │ • 테마 설정   │               │ • 지오코딩    │
    │ • 선택된 위치 │               │ • 자동 갱신   │
    └───────────────┘               └───────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
                    ┌───────────────┐
                    │   React UI    │
                    └───────────────┘
```

## 추가 구현 사항 (요구사항 외)

| 기능 | 설명 |
|------|------|
| 드래그 앤 드롭 | @dnd-kit을 활용한 즐겨찾기 순서 변경 |
| 다크모드 | 시스템 설정 연동 및 수동 전환 |
| 자동 갱신 | 1시간마다 날씨 데이터 자동 새로고침 |
| 기본 위치 | 위치 권한 거부 시 서울 강남구 표시 |
| 삭제 확인 | 즐겨찾기 삭제 전 확인 모달 |
| 커스텀 스크롤바 | 시간별 예보 영역 스크롤바 스타일링 |

## API

### 날씨 데이터
- **Open-Meteo API** (무료, API 키 불필요)
- 현재 날씨, 시간별 예보 제공

### 지오코딩
- **Nominatim API** (OpenStreetMap)
- 한국 지역 검색용 로컬 JSON 데이터 병행 사용

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이선스

MIT License
