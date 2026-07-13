# Quokka Smile Project

쿼카의 웃는 듯한 얼굴을 중심으로 행복, 힐링, 생태 보호 메시지를 전하는 정적 브랜드 웹사이트입니다.  
따뜻한 노란색과 부드러운 브라운 톤을 사용해 귀엽지만 가볍지만은 않은 분위기를 목표로 합니다.

## 주요 기능

- 메인 브랜드 페이지
  - 쿼카 소개, 매력 카드, 보호 메시지 CTA로 구성되어 있습니다.
  - `행복 공유하기` 버튼은 브라우저가 지원하면 Web Share API를 사용하고, 지원하지 않으면 클립보드 복사를 시도합니다.
  - `캠페인 참여하기`, `굿즈 아이디어 보기` 버튼으로 관련 페이지로 이동합니다.

- 굿즈 아이디어 페이지
  - 쿼카 소개 카드, 인형, 티셔츠, 후드, 안아주기 베개, 향기 봉지, 슬리퍼, 안대 등 굿즈 콘셉트를 카드 그리드로 보여줍니다.
  - 검색창과 카테고리 필터로 굿즈 아이디어를 빠르게 찾을 수 있습니다.
  - 실제 판매 페이지가 아니라 브랜드 기획용 아이디어 페이지입니다.

- 캠페인 페이지
  - 쿼카와 생태 보호 메시지를 이어 주는 캠페인 성격의 페이지입니다.
  - 메인 페이지와 같은 헤더, 색상, 폰트, 카드 스타일을 공유합니다.

- 공통 UI 및 인터랙션
  - 모바일 햄버거 메뉴를 제공합니다.
  - 라이트/다크 테마 전환을 지원하고 선택값을 `localStorage`에 저장합니다.
  - 한국어/영어 언어 전환 구조가 있으며 선택값을 `localStorage`에 저장합니다.
  - 스크롤 reveal 효과와 현재 섹션 활성 표시를 `IntersectionObserver`로 처리합니다.
  - 주요 동작 결과는 Toast 메시지로 짧게 안내합니다.
  - `prefers-reduced-motion` 설정을 고려해 움직임을 줄일 수 있게 구성되어 있습니다.

## 사용 기술

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
  - `Gowun Dodum`
  - `Jua`
- 브라우저 기본 Web API
  - `navigator.share`
  - `navigator.clipboard`
  - `localStorage`
  - `IntersectionObserver`
  - `matchMedia`
  - `window.location`

별도의 프레임워크, 번들러, npm 패키지는 사용하지 않습니다.

## 파일 구조

```text
happiest_animal/
├─ index.html
├─ goods.html
├─ campaign.html
├─ assets/
│  ├─ css/
│  │  ├─ index.css
│  │  ├─ goods.css
│  │  └─ campaign.css
│  ├─ js/
│  │  ├─ preload.js
│  │  ├─ index.js
│  │  ├─ goods.js
│  │  └─ campaign.js
│  └─ images/
│     └─ quokka-favicon.png
├─ DESIGN.md
├─ AGENTS.md
└─ README.md
```

## 실행 방법

정적 웹사이트라서 별도 설치 과정이 필요하지 않습니다.

1. 프로젝트 폴더를 엽니다.
2. `index.html` 파일을 브라우저로 실행합니다.
3. 상단 메뉴나 버튼을 통해 `goods.html`, `campaign.html`로 이동할 수 있습니다.

## 반응형 기준

현재 CSS는 다음 화면 너비를 중심으로 반응형 레이아웃을 조정합니다.

- 데스크톱: `1025px` 이상
- 태블릿: `1024px` 이하
- 모바일: `700px` 이하
- 작은 모바일: `430px` 이하

굿즈 카드는 데스크톱에서 여러 열, 태블릿에서 2열, 모바일에서 1열로 표시됩니다.

## 디자인 방향

- 브랜드 컬러는 CSS 변수로 관리합니다.
  - `--yellow`
  - `--yellow-light`
  - `--brown`
  - `--brown-dark`
  - `--cream`
  - `--white`
- 공통 컨테이너는 `.page` 클래스를 사용합니다.
- 공통 버튼은 `.btn` 기반 클래스를 재사용합니다.
- 카드, CTA, 헤더는 둥근 모서리와 부드러운 그림자로 따뜻한 분위기를 유지합니다.

## 참고 및 제한 사항

- 현재 일부 이미지는 외부 URL에 의존합니다. 운영 배포 전에는 사용 권한을 확인한 이미지를 `assets` 또는 `imgs` 폴더에 저장해 사용하는 것이 좋습니다.
- CSS와 JavaScript는 `assets/css`, `assets/js`로 분리되어 있습니다. 현재는 페이지별 파일 중심이며, 반복 코드가 더 늘어나면 `common.css`, `common.js`로 공통 코드를 한 번 더 묶을 수 있습니다.
- 굿즈 페이지는 실제 구매 기능이 아니라 아이디어 소개용입니다. 가격, 재고, 결제 기능은 포함되어 있지 않습니다.
