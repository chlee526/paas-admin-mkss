# 2023 - 시장센싱

### 목차

0. [이슈](#이슈)
1. [History](#History)
2. [정보](#정보)
3. [설정](#설정)
4. [구조](#구조)
5. [FTP 정보](#FTP-정보)
6. [개발 Server 정보](#개발-Server-정보)
7. [Local Server 설정](#Local-Server-설정)
8. [배포](#배포)
9. [Components](#Components)

---

### History

| 일자       | 버전  | 내용                                   |
| ---------- | ----- | -------------------------------------- |
| 2025-03-24 | 1.0.0 | 서버 이관에 따른 서버,도메인 변경      |
| 2024-08-08 | 1.0.0 | 제품입력(이름,램,심) input에 trim 추가 |
| 2023-08-09 | 1.0.0 | 프로젝트 생성                          |

---

#### 정보

-   삼성전자 수요예측 무선 시장센싱(신규등록 관리)
-   node: - v18
-   작업목록(QA) : -
-   API가이드 : - 
-   브랜치
    -   main: 운영 [운영 서버 반영 용]
    -   hotfix/경로-수정기능(페이지/컨텐츠/모듈/컴포넌트): 운영 긴급 패치
    -   release: 운영 반영 전 테스트 [개발 서버 반영 용]
    -   devel: 개발 통합
    -   feature/경로-기능(페이지/컨텐츠/모듈/컴포넌트): 기능별 개발

---

### 설정

1. package.json - 프로젝트명/디펜던시 확인
2. vue.config.js - 개발서버 설정(port: 8602~, Shared 리드미 확인), 로컬 호스트 등록필수
3. env - 환경설정, API경로(API연결이 되야함)
4. 구동 테스트 `npm run dev`
5. 프로젝트 설정

    ###### ①. 스타일 설정

    공용 스타일에서 1차로 설정되며, 프로젝트 스타일에서 재설정 해서 사용.

    ```js
    ■■ 공용 ■■
    @shared/styles/

    ■■ 프로젝트 ■■
    /src/assets/css/
    ./override : 프로젝트에서 다시 설정되어야 하는 스타일
    ./vendors : 프로젝트 전용 외부 라이브러리 스타일
    ./view : 프로젝트 전용 컨텐츠

    스타일 추가 후, './design.scss' 에서 관리
    ```

    ###### ②. vendor(설치형이 아닌 외부라이브러리) 설정

    ```js
    ■■ 공용 ■■
    @shared/library/
    해당폴더의 모든 라이브러리 파일은 자동 import 됨.

    ■■ 프로젝트 ■■
    /src/assets/js/
    가능하다면 설치형으로 의존성 주입
    ```

    ###### ③. 로고 설정

    텍스트 or 이미지 설정이 가능하며, env설정 파일에서 설정.
    아래는 이미지로 사용할 경우의 예시임

    ```js
    .env
    VUE_APP_TITLE_IMG = 'h1_logo.png'

    아래 경로에 이미지 파일 저장
    /src/assets/img/
    ```

    ###### ④. 사용 컴포넌트 설정

    ```js
    ■■ 공용 ■■
    /src/plugins/global-components.js
    프로젝트에서 사용할 공용 컴포넌트를 import 한다. 단 사용빈도를 고려해서 등록.
    최초 설정은 모든 컴포넌트 사용이기 때문에, 사용하지 않는 컴포넌트 제거한다.

    ■■ 프로젝트 ■■
    프로젝트 내에서 컴포넌트를 등록할시 README.md > '주요 컴포넌트'에 해당 컴포넌트를 게시함.
    컴포넌트 생성시 구조는 아래와 같다.
    ----------------------
    ● components
        ● 컴포넌트명
            index.vue
            README.md
    ----------------------
    README.md 파일은 기존 컴포넌트(모듈)과 같은 형태로 작성 한다.
    ```

    ###### ⑤. Router 설정

    development 모드 일때는 권한이 전부 true로 설정 됨.
    프로젝트에서 설정되는 라우터 정보는 공용을 제외한 전체 페이지 라우터 정보이며, API를 통해 권한 설정 될때, route정보가 갱신 됨.

    ```js
    ■■ 공용 ■■
    @shared/router/index.js
    'fixRoutes'에 공용 라우터 정보가 추가되어 있음.
    프로젝트에서 추가하는 route정보는 'fixRoutes'의 [5] index에 추가 됨.

    ■■ 프로젝트 ■■
    /src/router/index.js
    'contentRoutes'에 프로젝트 전체 메뉴(권한) 설정
    ```

    ###### ⑥. Store 설정

    ```
    ■■ 공용 ■■
    @shared/store/modules/setting.js : 프로젝트 설정
    @shared/store/modules/user.js : 사용자
    @shared/store/modules/opts.js : 주요 코드 목록
    @shared/store/getters.js : store Getter 관리

    ■■ 프로젝트 ■■
    /src/store/
    공용의 store를 override해서 사용 하거나, 신규로 추가해서 사용 가능.
    ./modules/opts.js : 분류체계 설정(API로 가저 오지 않는 코드는 직접 등록)
    ./getters.js에 getter등록
    ```

    ###### ⑦. View 컨텐츠 제작

    ```
    /src/view/
    컨텐츠
    ```

    ###### ⑧. README.md 파일 교체

    ```js
    '프로젝트 - README.md' -> 'README.md'
    위 파일을 프로젝트의 README로 교체 작성 한다
    ```

---

### 구조

전용 리스소

-   <strong>env</strong> ··············// 공통 환경설정
-   <strong>env.development</strong> ··············// 개발 전용 환경설정
-   <strong>env.production</strong> ··············// 프로젝트 전용 환경설정
-   <strong>src</strong>
    -   <strong>api</strong> ··············// api
        -   <strong>validation.js</strong> ··············// api 유효성 체크
        -   <strong>inquire.js</strong> ··············// 제품 정보 조회 API(신규등록, 최종검수 공통)
        -   <strong>inspection</strong> ··············// 최종 검수 API
        -   <strong>register</strong> ··············// 신규 등록 API
        -   <strong>statistics</strong> ··············// 등록 통계 API
    -   <strong>assets</strong> ··············// assets
        -   <strong>css</strong> ··············// style
            -   <strong>override</strong> ··············// Override 스타일
            -   <strong>vendors</strong> ··············// 외부자원 스타일
            -   <strong>view</strong> ··············// 컨텐츠
            -   <strong>design.scss</strong> ··············// 스타일 관리
        -   <strong>img</strong> ··············// img
        -   <strong>js</strong> ··············// 외부js
    -   <strong>components</strong> ··············// 프로젝트 전용 컴포넌트
    -   <strong>filters</strong> ··············// 전역필터
    -   <strong>layout</strong> ··············// layout
    -   <strong>plugins</strong> ··············// 공용/전용 컴포넌트 등록 및 관리
        -   <strong>global-components.js</strong> ··············// 컴포넌트 등록 및 관리
    -   <strong>router</strong> ··············// router관리
    -   <strong>store</strong> ··············// store
        -   <strong>modules</strong> ··············// Module
            -   <strong>helper.js</strong> ··············// 도움말(store로 관리 필수)
            -   <strong>opts.js</strong> ··············// 분류체계
        -   <strong>getters.js</strong> ··············// Store Getter 관리
    -   <strong>utils</strong>··············// 프로젝트 전용 util
    -   <strong>view</strong>··············// 컨텐츠

---

#### Components

|    분류    | 이름                                                                          |
| :--------: | :---------------------------------------------------------------------------- |
|    공통    | [CompInputMkt](./src/components/input/CompInputMkt/README.md)                 |
|    공통    | [CompInputRAM](./src/components/input/CompInputRAM/README.md)                 |
|    공통    | [CompInputSIM](./src/components/input/CompInputSIM/README.md)                 |
|    공통    | [CompPagination](./src/components/pagination/README.md)                       |
|    공통    | [CompTopsearchAdmin](./src/components/top_search_admin/README.md)             |
| inspection | [CompTableBody](./src/view/new/inspection/components/CompTableBody/README.md) |
|  register  | [CompTableRow](./src/view/new/register/components/CompTableRow/README.md)     |
