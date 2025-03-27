# 프로젝트명

### 목차

1. History
2. Project 정보
3. FTP 정보
4. Server 정보
5. Local Server 설정
6. 배포

---

### History

| 일자       | 버전  | 내용          |
| ---------- | ----- | ------------- |
| 2023-07-31 | 1.0.0 | 프로젝트 생성 |

---

#### Project 정보

-   node: - v18
-   작업목록(QA) : -
-   API가이드 : - https://docs.google.com/spreadsheets/d/1UadpLD6xI5XdelzPXwgJh9VIU5n64IXWsXv6aAcHbQk/edit#gid=1695874547
-   브랜치
    -   mokup: 목업
    -   main: 운영
    -   devel: 개발

---

#### FTP 정보

-   58.180.24.44
-   id/pw: 기존 서비스와 동일

-   Dashboard(운영) : /usr/local/apache/htdocs/shinhancard/dashboard
-   Dashboard(개발) : /usr/local/apache/htdocs/shinhancard_i_dev/dashboard
-   Dashboard(목업) : /usr/local/apache/htdocs/shinhancard_i/dashboard

---

#### Server 정보

-   Dashboard(운영) : https://signal.realsn.com
-   Dashboard(개발) : http://signaldev.realsn.com
-   Dashboard(목업) : https://signal1.realsn.com

---

#### Local Server 설정

-   http://fe.workspace.prj.signal.realsn.com:8602

```
// 서버 시작
npm run dev
```

---

#### 배포

// 배포 버전 생성
npm run build

// 개발 버전 생성
npm run build:dev

// 개발/배포 버전 한번에 생성
npm run generate

```

```
