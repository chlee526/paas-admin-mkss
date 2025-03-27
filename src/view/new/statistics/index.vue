<template>
    <div id="content">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap ui-loader-container" :class="{ 'is-loading': loading }">
            <!-- // 검색조건 -->
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col notranslate">
                                <div class="ui_box" data-track="등록 통계">
                                    <div class="ui_function">
                                        <div class="rc">
                                            <comp-pagination :row_limit="brdOpts.row_limit" :total-len="brdDatas.total_cnt" v-model="brdOpts.page_num"></comp-pagination>
                                            <hr />
                                            <span
                                                >통계작성시간 : <strong>{{ this.brdDatas.st_date_time }}</strong></span
                                            >
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="ui_brd custom-style">
                                            <div class="wrap">
                                                <table>
                                                    <colgroup>
                                                        <col width="200px" />
                                                        <col width="200px" />
                                                        <col />
                                                        <col />
                                                        <col />
                                                        <col width="100px" />
                                                        <col width="200px" />
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <strong>일자</strong>
                                                            </th>
                                                            <th>
                                                                <strong>작업자</strong>
                                                            </th>
                                                            <th>
                                                                <strong>Y (제품)</strong>
                                                            </th>

                                                            <th>
                                                                <strong>P (보류)</strong>
                                                            </th>
                                                            <th>
                                                                <strong>N (삭제)</strong>
                                                            </th>

                                                            <th colspan="2">
                                                                <strong>TOTAL</strong>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <!-- 데이터 없는 경우 -->
                                                    <tbody v-if="getParseBrdList.length == 0" class="is-no-over">
                                                        <tr v-for="$idx in 2" v-bind:key="`top_${$idx}`" class="is-no-over">
                                                            <td :colspan="brdOpts.colCnt"></td>
                                                        </tr>
                                                        <tr class="is-no-over">
                                                            <td :colspan="brdOpts.colCnt" class="no_over no_data in_list">
                                                                <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                                            </td>
                                                        </tr>
                                                        <tr v-for="$idx in 3" v-bind:key="`bot_${$idx}`" class="is-no-over">
                                                            <td :colspan="brdOpts.colCnt"></td>
                                                        </tr>
                                                    </tbody>
                                                    <!-- // 데이터 없는 경우 -->

                                                    <!-- 데이터 있는 경우 -->
                                                    <tbody v-for="(item, $idx) in getParseBrdList" :key="$idx">
                                                        <tr v-for="(data, data_idx) in item.list" :key="`list_${data_idx}`" class="is-no-over">
                                                            <td v-if="data_idx === 0" :rowspan="item.list.length">
                                                                <strong>{{ item.REG_DATE }}</strong>
                                                            </td>
                                                            <td :class="{ 'is-over': `${$idx}_${data_idx}` == overIdx }" @mouseenter="overIdx = `${$idx}_${data_idx}`" @mouseleave="overIdx = null">
                                                                <span>{{ data.WORKER }}</span>
                                                            </td>
                                                            <td :class="{ 'is-over': `${$idx}_${data_idx}` == overIdx }" @mouseenter="overIdx = `${$idx}_${data_idx}`" @mouseleave="overIdx = null">
                                                                <span>{{ data.PRD_CNT.addComma() }}</span>
                                                            </td>
                                                            <td :class="{ 'is-over': `${$idx}_${data_idx}` == overIdx }" @mouseenter="overIdx = `${$idx}_${data_idx}`" @mouseleave="overIdx = null">
                                                                <span>{{ data.POT_CNT.addComma() }}</span>
                                                            </td>
                                                            <td :class="{ 'is-over': `${$idx}_${data_idx}` == overIdx }" @mouseenter="overIdx = `${$idx}_${data_idx}`" @mouseleave="overIdx = null">
                                                                <span>{{ data.DEL_CNT.addComma() }}</span>
                                                            </td>
                                                            <td class="is-total" :class="{ 'is-over': `${$idx}_${data_idx}` == overIdx }" @mouseenter="overIdx = `${$idx}_${data_idx}`" @mouseleave="overIdx = null">
                                                                <strong>{{ data.TOTAL_CNT.addComma() }}</strong>
                                                            </td>
                                                            <td v-if="data_idx === 0" class="is-total" :rowspan="item.list.length">
                                                                <strong>{{ item.DAILY_TOT.addComma() }}</strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody v-if="brdDatas.list.length">
                                                        <tr>
                                                            <td colspan="2">
                                                                <strong>TOTAL</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{{ getTotal('PRD_CNT').addComma() }}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{{ getTotal('POT_CNT').addComma() }}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{{ getTotal('DEL_CNT').addComma() }}</strong>
                                                            </td>
                                                            <td colspan="2">
                                                                <strong>{{ getTotal('TOTAL_CNT').addComma() }}</strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    <!-- // 데이터 있는 경우 -->
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';

import CompPagination from '@/components/pagination';
import { API_datalist } from '@/api/statistics/datalist';

export default {
    name: 'Common-layout',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            overIdx: null,
            brdOpts: {
                colCnt: 7,
                row_limit: 5, // 게시판 Row
                page_num: 1, // 현재 페이지 번호
            },
            brdDatas: {
                st_date_time: `${new Date().dateToStr()} / 00:00`,
                total_cnt: 0,
                list: [], //getParseBrdList로 parse해서 페이지에 적용
            },
        };
    },
    watch: {
        brdOpts: {
            deep: true,
            handler() {
                this.fetchData();
            },
        },
    },
    computed: {
        getParseBrdList() {
            let result = [];
            // 날짜기준 한 그룹으로 묶기
            this.brdDatas.list.forEach((data) => {
                const { TOTAL_CNT, WORKER, PRD_CNT, POT_CNT, DEL_CNT, REG_DATE } = data;
                const index = result.findIndex((item) => item.REG_DATE === REG_DATE);

                if (index !== -1) {
                    // 일일 합계
                    result[index].DAILY_TOT += Number(TOTAL_CNT);
                    result[index].list.push({ WORKER, TOTAL_CNT, PRD_CNT, POT_CNT, DEL_CNT });
                } else {
                    result.push({
                        REG_DATE,
                        DAILY_TOT: Number(TOTAL_CNT),
                        list: [{ WORKER, TOTAL_CNT, PRD_CNT, POT_CNT, DEL_CNT }],
                    });
                }
            });

            // 작업자 정렬 (작업자 1,2 > 작업자 3,4 > 관리자 > 시스템 순)
            if (result.length) {
                result = result.map((datas) => {
                    const list = [...datas.list];
                    list.map((item) => {
                        switch (item.WORKER) {
                            case '작업자1,2': {
                                item.ORDER = 1;
                                break;
                            }
                            case '작업자3,4': {
                                item.ORDER = 2;
                                break;
                            }
                            case '작업자5,6': {
                                item.ORDER = 3;
                                break;
                            }
                            case '작업자7,8': {
                                item.ORDER = 4;
                                break;
                            }
                            case '관리자': {
                                item.ORDER = 5;
                                break;
                            }
                            case '시스템': {
                                item.ORDER = 6;
                                break;
                            }
                            default:
                                item.ORDER = -1;
                        }
                        return item;
                    });

                    datas.list = list.sort((a, b) => a.ORDER - b.ORDER);

                    return datas;
                });
            }
            return result;
        },
    },
    components: {
        'comp-pagination': CompPagination,
    },
    mounted() {
        this.fetchData();
    },

    methods: {
        async fetchData() {
            this.loading = true;

            const params = {
                page_num: this.brdOpts.page_num,
                rowLimit: 5,
            };

            await API_datalist(this.apiUID, params)
                .then((res) => {
                    const { st_date_time, page_num, total_cnt, list } = structuredClone(res.data.result);

                    this.brdDatas.st_date_time = st_date_time;
                    this.brdOpts.page_num = page_num || 1;
                    this.brdDatas.total_cnt = Number(total_cnt) || 0;
                    this.brdDatas.list = list ? [...list] : []; //getParseBrdList로 parse해서 페이지에 적용
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getTotal(key) {
            let result = 0;
            this.brdDatas.list.forEach((item) => {
                result = result + Number(item[key]);
            });
            return result;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
