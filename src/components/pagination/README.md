# CompPagination

-   기존 페이지네이션 컴포넌트 간소화
-   현재 페이지, 전체 페이지 갯수로 구성

### 목차

1. [History](#history)
2. [File](#file)
3. [Useage](#useage)
4. [Props](#props)
5. [Events](#events)

---

### History

| 일자       | 버전  | 내용        |
| ---------- | ----- | ----------- |
| 2023-09-20 | 1.0.0 | README 작성 |

---

#### File

| 파일명 | 타입  | 설명     |
| ------ | ----- | -------- |
| index  | index | 컴포넌트 |

---

#### Useage

```vue
<comp-pagination :row_limit="brdOpts.row_limit" :total-len="brdDatas.total_cnt" v-model="brdOpts.page_num"></comp-pagination>
```

---

#### Props

| 필수 | Prop          | 설명                     | 타입/값  | Default |
| :--: | :------------ | :----------------------- | -------- | ------- |
|  ✔   | **totalLen**  | 전체 데이터 갯수         | `Number` |         |
|  ✔   | **row_limit** | 한 페이지당 행 갯수 제한 | `Number` |         |
|      | **limitLen**  | 전체 데이터 최대 갯수    | `Number` |         |
|  ✔   | **value**     | 현재 페이지              | `Number` |         |

---
