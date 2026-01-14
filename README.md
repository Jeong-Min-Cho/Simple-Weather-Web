# Weather App

한국 지역 날씨 정보 웹앱

## 실행 방법

```bash
npm install
npm run dev
```

## 기능

- 현재 위치 기반 날씨 조회
- 시/군/구/동 단위 지역 검색
- 24시간 시간대별 예보
- 즐겨찾기 (최대 6개, 드래그로 순서 변경, 별칭 설정)
- 다크모드

## 기술 스택

- Next.js 16 + TypeScript
- TailwindCSS v4
- TanStack Query (서버 상태) + Zustand (클라이언트 상태)
- Open-Meteo API (날씨) + Nominatim (지오코딩)

## 기술적 의사결정

### Open-Meteo API 선택
OpenWeatherMap 대신 Open-Meteo를 선택했습니다. API 키 없이 바로 사용할 수 있고, 요청 제한이 넉넉해서 개발과 테스트가 편했습니다. 시간대별 예보 데이터도 충분히 제공됩니다.

### Zustand + TanStack Query 조합
서버 데이터(날씨 정보)는 TanStack Query로, 클라이언트 데이터(즐겨찾기, 테마)는 Zustand로 분리했습니다. Redux보다 보일러플레이트가 적고, Zustand의 persist 미들웨어로 localStorage 연동이 간단합니다.

### Next.js App Router
React만 써도 되지만 Next.js를 선택한 이유는 파일 기반 라우팅이 편하고, 추후 SSR이나 ISR이 필요할 때 확장하기 좋아서입니다.

### 로컬 JSON 검색 + Nominatim 병행
korea_districts.json으로 빠른 자동완성을 제공하고, 실제 좌표는 Nominatim API로 가져옵니다. 로컬 데이터만으로는 좌표가 없고, API만으로는 자동완성이 느려서 둘을 조합했습니다.

## 프로젝트 구조

```
src/
├── app/                 # 페이지, 레이아웃
├── features/            # 날씨 API, 지역 검색
├── widgets/             # 날씨 카드, 시간별 예보, 즐겨찾기
├── entities/            # 날씨 아이콘, 온도 표시
└── shared/              # 공통 UI, 훅, 상태, 유틸
```

## 추가 구현

- 드래그 앤 드롭 즐겨찾기 정렬 (@dnd-kit)
- 1시간마다 날씨 자동 갱신
- 위치 권한 거부 시 기본 위치(서울 강남구) 표시
- 즐겨찾기 삭제 확인 모달
