# input > CompInputSIM

-   SIM input 커스텀 컴포넌트
-   등록, validation 기능 내장

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

| 파일명 | 타입  | 설명                    |
| ------ | ----- | ----------------------- |
| index  | index | SIM 전용 input 컴포넌트 |

---

#### Useage

```vue
// 기본
<comp-input-sim v-model="item.RESULT_DUAL_SIM" :item="item" :autoComplete="autoComplete.dual_sim" :dualSimList="dualSimList" menu="inspection" :saved-data="saved.dual_sim" @registProduct="registProduct"></comp-input-sim>

// 일괄적용
<comp-input-sim v-model="allApplyOpts.dual_sim" :data="allApplyOpts" :multiRegister="true" :autoComplete="autoComplete.dual_sim" :dualSimList="dualSimListOnlyName"></comp-input-sim>
```

---

#### Props

| 필수 | Prop              | 설명                                                                 | 타입/값                                                 | Default |
| :--: | :---------------- | :------------------------------------------------------------------- | ------------------------------------------------------- | ------- |
|      | **item**          | SEQ 등 제품등록에 필요한 정보를 담은 행 데이터<br>일괄 적용은 해당 x | `Object`                                                |         |
|      | **menu**          | 컴포넌트 사용 메뉴명<br>일괄 적용은 해당 X                           | `String`<br>`register(신규등록)`,`inspection(최종검수)` |         |
|      | **multiRegister** | 일괄 적용 여부                                                       | `Boolean`                                               | false   |
|      | **data**          | 일괄 적용 데이터                                                     | `Object`                                                |         |
|      | **savedData**     | DB에 저장된 값                                                       | `String`                                                |         |
|      | **value**         | v-model                                                              | `String`                                                |         |
|      | **autoComplete**  | 자동완성 목록                                                        | `Array`                                                 |         |
|      | **dualSimList**   | SIM 입력 가능 목록                                                   | `Array`                                                 |         |

---

#### Events

|       Event       | 설명                 | Callback |
| :---------------: | :------------------- | :------- |
| **registProduct** | 제품 등록 API 결과값 | `Object` |
