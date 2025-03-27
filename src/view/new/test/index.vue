<template>
    <div id="content">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap">
            <!-- // 검색조건 -->
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <div class="ui_box ui-loader-container" :class="{ 'is-loading': loading }" data-track="등록 통계">
                                    <div class="content">
                                        <p><strong>http://mkssd.realsn.com:8899/api/?cmd=SG 결과값:</strong></p>
                                        {{ data }}
                                        <br /><br /><br />
                                        <p><strong>{cmd : 'SG'} 결과값:</strong></p>
                                        {{ data2 }}
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
import CompPagination from '@/components/pagination';
import { uuid } from 'vue-uuid';
import { API_datalist as test } from '@/api/test.js';
import { API_datalist } from '@/api/statistics/datalist';

export default {
    name: 'Common-layout',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            brdOpts: {
                colCnt: 7,
                row_limit: 5, // 게시판 Row
                brdSort: 'orderColumn_seq', // 게시판 정렬 : name + id + ( up or dn )
                page_num: 1, // 현재 페이지 번호
            },
            brdDatas: {
                st_date_time: `${new Date().dateToStr()} / 00:00`,
                total_cnt: 0,
                list: [],
            },
            data: {},
            data2: {},
        };
    },
    computed: {
        getParseBrdList() {
            const result = [];
            this.brdDatas.list.forEach((data) => {
                console.log(result.find((item) => item.REG_DATE === data.REG_DATE));
            });
            return result;
        },
    },
    components: {
        // 'comp-pagination': CompPagination,
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
            await test(this.apiUID, params)
                .then((res) => {
                    this.data = res.data;
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });

            await API_datalist(this.apiUID, params)
                .then((res) => {
                    this.data2 = res.data;
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
