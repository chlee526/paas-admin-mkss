# register > CompTableRow

-   table 행 관리 컴포넌트

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

| 파일명 | 타입  | 설명                   |
| ------ | ----- | ---------------------- |
| index  | index | table 행 관리 컴포넌트 |

---

#### Useage

```vue
<tbody v-else>
    <template v-for="(item, $idx) in brdDatas.list">
        <comp-table-row :key="`tr_${$idx}`" :brdData="brdDatas.list[$idx]" :col-opts="getColOpts" :dual-sim-list="dualSimListOnlyName" :checkedItem.sync="checkedItems"></comp-table-row>
    </template>
</tbody>
```

---

#### Props

| 필수 | Prop            | 설명                              | 타입/값  | Default |
| :--: | :-------------- | :-------------------------------- | -------- | ------- |
|      | **id**          | 아이디                            | `String` |         |
|      | **brdData**     | 행 데이터                         | `Object` |         |
|      | **colOpts**     | 열 v-if 관리하는 항목 설정 데이터 | `Object` |         |
|      | **dualSimList** | SIM 입력 가능 목록                | `Array`  |         |
|      | **checkedItem** | 체크 목록                         | `Array`  |         |

---
