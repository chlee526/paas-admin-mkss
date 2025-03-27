<template>
    <div id="content">
        <h2 id="page_title" class="ui_invisible"></h2>
        <main class="wrap ui-loader-container" :class="{ 'is-loading': loading }">
            <!-- // 검색조건 -->
            <div class="contents">
                <div class="wrap">
                    <div class="ui_row">
                        <div class="wrap">
                            <div class="ui_col">
                                <div id="sec_inspection" class="ui_box" data-track="최종 검수">
                                    <div class="ui_function notranslate">
                                        <div class="lc">
                                            <div class="grp">
                                                <span style="width: 60px"
                                                    >선택 <strong>{{ getCheckedCnt }}</strong
                                                    >개</span
                                                >
                                                <comp-button v-if="permissions.inspection_confirm" class="is-small is-color-black" @click="clickAccept" style="width: 80px">
                                                    <span class="txt">수락</span>
                                                </comp-button>

                                                <comp-button v-if="permissions.reset" class="is-small" @click="clickReset" style="width: 80px">
                                                    <span class="txt">초기화</span>
                                                </comp-button>
                                            </div>
                                            <hr v-if="permissions.reset" />
                                            <div class="grp">
                                                <span>작업자 보기</span>
                                                <comp-checkbox-grp
                                                    id="viewTab_radio"
                                                    class="is-small workerGrp"
                                                    name="tab"
                                                    v-model="grpCode"
                                                    :opts="[
                                                        { code: '1', name: '1, 2' },
                                                        { code: '2', name: '3, 4' },
                                                        { code: '3', name: '5, 6' },
                                                        { code: '4', name: '7, 8' },
                                                    ]"
                                                    style="margin-left: 6px"
                                                    :box="true"
                                                    :allUnchkDisabled="true"></comp-checkbox-grp>
                                                <comp-button class="is-small is-color-black" @click="fetchData">
                                                    <span class="txt">조회</span>
                                                </comp-button>
                                            </div>
                                        </div>
                                        <div class="rc">
                                            <comp-pagination :row_limit="brdOpts.row_limit" :total-len="brdDatas.total_cnt" v-model="brdOpts.page_num"></comp-pagination>
                                            <span
                                                >총 <strong>{{ brdDatas.total_cnt.addComma() }}</strong
                                                >건</span
                                            >
                                            <hr />
                                            <comp-filter-grp class="is-small" pos="BR">
                                                <template v-slot:title>항목 설정</template>
                                                <template v-slot:items>
                                                    <dl v-for="item in Object.keys(getColOpts)" :key="item">
                                                        <dt>
                                                            <strong>{{ item === 'regdate' ? '마스터 등록일' : item }}</strong>
                                                        </dt>
                                                        <dd>
                                                            <comp-switch-btn :id="`${item}_switch`" class="is-small" v-model="getColOpts[item]"></comp-switch-btn>
                                                        </dd>
                                                    </dl>
                                                </template>
                                            </comp-filter-grp>
                                        </div>
                                    </div>

                                    <div class="content">
                                        <div class="ui_brd custom-style">
                                            <div class="wrap">
                                                <table>
                                                    <colgroup>
                                                        <col width="50px" />
                                                        <col v-if="getColOpts.seq" width="100px" />
                                                        <col v-if="getColOpts.title" width="40%" />
                                                        <col v-if="getColOpts.mkt_name" width="30%" />
                                                        <col v-if="getColOpts.RAM" width="90px" />
                                                        <col v-if="getColOpts.dual_sim" width="90px" />
                                                        <col v-if="getColOpts.mkt_name_final" width="30%" />
                                                        <col v-if="getColOpts.RAM_final" width="100px" />
                                                        <col v-if="getColOpts.dual_sim_final" width="100px" />
                                                        <col v-if="getColOpts.WON" width="100px" />
                                                        <col v-if="getColOpts.regdate" width="100px" />
                                                    </colgroup>
                                                    <thead class="notranslate">
                                                        <tr>
                                                            <th>
                                                                <comp-checkbox id="inspection_allCheck" class="is-small is-board" v-model="allCheck" @click="clickAllCheck"> </comp-checkbox>
                                                            </th>
                                                            <th v-if="getColOpts.seq">
                                                                <strong>seq</strong>
                                                                <comp-table-sort id="AA.pm_seq" name="orderColumn" v-model="getBrdSort" :minOneValue="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.title">
                                                                <strong>title<br />site_url</strong>
                                                                <comp-table-sort id="AA.d_title" name="orderColumn" v-model="getBrdSort" :minOneValue="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.mkt_name">
                                                                <strong>mkt_name</strong>
                                                            </th>
                                                            <th v-if="getColOpts.RAM">
                                                                <strong>RAM</strong>
                                                            </th>
                                                            <th v-if="getColOpts.dual_sim">
                                                                <strong>Dual_sim</strong>
                                                            </th>
                                                            <th v-if="getColOpts.mkt_name_final">
                                                                <strong>mkt_name<br />(최종)</strong>
                                                            </th>
                                                            <th v-if="getColOpts.RAM_final">
                                                                <strong>RAM<br />(최종)</strong>
                                                            </th>
                                                            <th v-if="getColOpts.dual_sim_final">
                                                                <strong>Dual_sim<br />(최종)</strong>
                                                            </th>
                                                            <th v-if="getColOpts.WON">
                                                                <strong>WON<br />RPA</strong>
                                                                <comp-table-sort id="cast(AA.retail_price_actual as unsigned)" name="orderColumn" v-model="getBrdSort" :minOneValue="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.regdate">
                                                                <strong>마스터<br />등록일</strong>
                                                                <comp-table-sort id="AA.reg_date" name="orderColumn" v-model="getBrdSort" :minOneValue="false"></comp-table-sort>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <!-- 데이터 없는 경우 -->
                                                    <tbody v-if="brdDatas.list.length == 0" class="is-no-over">
                                                        <tr v-for="$idx in Math.floor((10 - 1) / 2)" v-bind:key="`top_${$idx}`" class="is-no-over">
                                                            <td :colspan="getColCnt"></td>
                                                        </tr>
                                                        <tr class="is-no-over">
                                                            <td :colspan="getColCnt" class="no_over no_data in_list">
                                                                <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                                            </td>
                                                        </tr>
                                                        <tr v-for="$idx in Math.ceil((10 - 1) / 2)" v-bind:key="`bot_${$idx}`" class="is-no-over">
                                                            <td :colspan="getColCnt"></td>
                                                        </tr>
                                                    </tbody>
                                                    <!-- // 데이터 없는 경우 -->

                                                    <!-- 데이터 있는 경우 -->
                                                    <comp-table-body v-for="(item, $idx) in brdDatas.list" :key="`${item.SEQ}_${$idx}`" :id="$idx" :brdData="brdDatas.list[$idx]" :col-opts="getColOpts" :dualSimList="dualSimList" :checkedItem="checkedItem" @clickCheckBox="clickCheckBox"></comp-table-body>
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
import { getItemLocalStorage, setItemLocalStorage } from '@shared/utils/localStorage';

import CompTableBody from './components/CompTableBody';

import CompPagination from '@/components/pagination';
import store from '@/store';
import { API_datalist } from '@/api/inspection/datalist';
import { API_reset } from '@/api/inspection/reset';
import { API_accept } from '@/api/inspection/accept';

export default {
    name: 'Common-layout',
    data() {
        return {
            apiUID: uuid.v4(),
            loading: false,
            brdOpts: {
                row_limit: 150, // 게시판 Row
                page_num: 1, // 현재 페이지 번호
            },
            brdDatas: {
                total_cnt: 0,
                list: [],
            },
            allCheck: false,
            checkedItem: {},
            autoComplete: {}, //RAM, SIM 자동완성 목록
            permissions: {
                inspection_confirm: false, // 수락 권한
                reset: false, // 초기화 권한
            },
            marketNameList: [], //제품  목록
            dualSimList: [], //듀얼심 목록
            grpCode: '1', // 작업자 보기

            // 개인화
            savePersonalization: {
                sec_inspection: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            seq: true,
                            title: true,
                            mkt_name: true,
                            RAM: true,
                            dual_sim: true,
                            mkt_name_final: true,
                            RAM_final: true,
                            dual_sim_final: true,
                            WON: true,
                            regdate: true,
                        },
                        //작업자 보기
                        viewTab: '1',
                        // 게시판 정렬 (기본 정렬 : WON 내림차순)
                        brdSort: 'cast(AA.won as unsigned)^D',
                    },
                },
            },
        };
    },
    components: {
        'comp-pagination': CompPagination,
        'comp-table-body': CompTableBody,
    },
    computed: {
        getColOpts() {
            return this.savePersonalization.sec_inspection.data_list.colOpts;
        },

        /**
         * 2024-06-03
         * 작업자 보기 -> 조회 버튼 추가로 인해 해당 기능 제거
         */
        // getViewTap: {
        //     get() {
        //         // 빈값일땐 선택값 1
        //         return this.savePersonalization.sec_inspection.data_list.viewTab || '1';
        //     },
        //     set(newValue) {
        //         // const oldValue = this.savePersonalization.sec_inspection.data_list.viewTab;
        //         this.savePersonalization.sec_inspection.data_list.viewTab = newValue;
        //         // if (oldValue !== newValue) this.fetchData();
        //     },
        // },

        getBrdSort: {
            get() {
                return this.savePersonalization.sec_inspection.data_list.brdSort;
            },
            set(val) {
                this.savePersonalization.sec_inspection.data_list.brdSort = val;
                this.fetchData();
            },
        },

        // 제품 조회 parameter용
        getBrdSortName() {
            const sortName = this.getBrdSort.replace(/\^D|\^A/g, (match) => (match === '^D' ? ' DESC' : ' ASC'));
            let result = 'cast(AA.won as unsigned) DESC';

            if (sortName.indexOf('AA.d_title') >= 0) {
                if (sortName.indexOf('DESC') >= 0) result = `${sortName},AA.p_url DESC,cast(AA.won as unsigned) DESC`;
                if (sortName.indexOf('ASC') >= 0) result = `${sortName},AA.p_url ASC,cast(AA.won as unsigned) DESC`;
            } else {
                result = !this.getBrdSort || sortName === 'cast(AA.won as unsigned) DESC' ? 'cast(AA.won as unsigned) DESC' : `${sortName},cast(AA.won as unsigned) DESC`;
            }
            return result;
        },

        getColCnt() {
            return Object.values(this.getColOpts).filter((val) => val).length + 1;
        },

        getCheckedCnt() {
            return Object.keys(this.checkedItem).filter((key) => this.checkedItem[key]).length;
        },
    },
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { codeSeq: '4,6' })
            .then((res) => {
                next((_this) => {
                    // mkt_name(제품), dual_sim 자동완성 목록 불러오기
                    if (res.data?.result) {
                        _this.$store.commit('opts/SET_MKTLIST', res.data.result.find((item) => item.name === '제품 목록')?.list || []);

                        const dualSimList = res.data.result.find((item) => item.name === '듀얼심 목록')?.list || [];
                        _this.dualSimList = dualSimList.map((item) => item.name);
                    }
                });
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['제품 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.error('error');
                    });
            });
    },
    created() {
        // 개인화 적용
        const personalization = getItemLocalStorage('personalization');
        this.savePersonalization = { ...this.savePersonalization, ...personalization?.inspection };
        this.grpCode = this.savePersonalization.sec_inspection.data_list.viewTab || '1';

        // 권한 설정
        const permissions = this.$route.query?.permissions?.permissions || [];
        this.permissions.inspection_confirm = permissions.includes('inspection_confirm') ? true : false;
        this.permissions.reset = permissions.includes('reset') ? true : false;
    },
    mounted() {
        this.fetchData();

        // mkt_name(제품), dual_sim 자동완성 목록 불러오기
        if (this.dualSimList.length <= 0) {
            this.$store.dispatch('opts/ATTRS', { codeSeq: '4,6' }).then((res) => {
                if (res.data?.result) {
                    this.$store.commit('opts/SET_MKTLIST', res.data.result.find((item) => item.name === '제품 목록')?.list || []);

                    const dualSimList = res.data.result.find((item) => item.name === '듀얼심 목록')?.list || [];
                    this.dualSimList = dualSimList.map((item) => item.name);
                }
            });
        }
    },
    watch: {
        brdOpts: {
            deep: true,
            handler(val) {
                // 조건 변경 시 스크롤 상단으로 이동
                window.scrollTo(0, 0);
                this.fetchData();
            },
        },

        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = { ...personalization, inspection: val };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },

        checkedItem: {
            deep: true,
            handler(val) {
                if (this.brdDatas.list.length) {
                    this.allCheck = Object.values(val).filter((item) => item).length == this.brdDatas.list.length;
                } else {
                    this.allCheck = false;
                }
            },
        },
    },
    methods: {
        async fetchData() {
            this.loading = true;

            /**
             * 2024-06-03
             * 작업자보기 조회 버튼 추가로 fetch될때만 작업자보기 로컬 저장
             */
            this.savePersonalization.sec_inspection.data_list.viewTab = this.grpCode;

            const params = {
                review: this.grpCode,
                page_num: this.brdOpts.page_num,
                rowLimit: this.brdOpts.row_limit,
                order_type: this.getBrdSortName,
            };
            await API_datalist(this.apiUID, params)
                .then((res) => {
                    const { page_num, total_cnt, list } = structuredClone(res.data?.result);

                    this.brdOpts.page_num = page_num || 1;
                    this.brdDatas.total_cnt = total_cnt || 0;
                    this.brdDatas.list = list ? [...list] : [];
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;

                    this.resetCheckBox();
                });
        },

        clickCheckBox(seq) {
            const tmp = structuredClone(this.checkedItem);
            tmp[seq] = !tmp[seq];
            this.$set(this, 'checkedItem', structuredClone(tmp));
        },

        // 전체 선택 체크박스 클릭
        clickAllCheck() {
            // object 사용
            const isAllChecked = !this.allCheck;
            const tmp = structuredClone(this.checkedItem);

            Object.keys(tmp).forEach((key) => {
                tmp[key] = isAllChecked;
            });

            this.$set(this, 'checkedItem', structuredClone(tmp));
        },

        // 체크박스 전체 체크 해제
        resetCheckBox() {
            const tmp = {};
            this.brdDatas.list.forEach((item) => {
                tmp[item.SEQ] = false;
            });
            this.checkedItem = structuredClone(tmp);
        },

        // 수락버튼 클릭
        async clickAccept() {
            const checkedList = Object.keys(this.checkedItem).filter((key) => this.checkedItem[key]);

            if (!checkedList.length) return;

            const params = { seq: checkedList.toString() };
            await API_accept(this.apiUID, params)
                .then((res) => {
                    if (res.data.result?.code === 200) {
                        this.$store.dispatch('NOTY_COM', '수락을 성공했습니다.');
                        this.resetCheckBox();
                    } else throw new Error();
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', '수락을 실패했습니다.');
                    console.error(err);
                });
        },

        // 초기화 버튼 클릭
        async clickReset() {
            const checkedList = Object.keys(this.checkedItem).filter((key) => this.checkedItem[key]);

            if (!checkedList.length) return;

            const params = { seq: checkedList.toString() };
            await API_reset(this.apiUID, params)
                .then((res) => {
                    if (res.data.result?.code === 200) {
                        this.$store.dispatch('NOTY_COM', '초기화를 성공했습니다.');
                        this.resetCheckBox();
                    } else throw new Error();
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', '초기화를 실패했습니다.');
                    console.error(err);
                });
        },
    },
};
</script>

<style lang="scss" src="./style.scss" scoped></style>
<style lang="scss">
.workerGrp {
    width: 160px;

    > * {
        flex: 1 1 !important;
    }
}
</style>
