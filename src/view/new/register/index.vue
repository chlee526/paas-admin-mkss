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
                                <div class="ui_box" data-track="신규등록">
                                    <div class="ui_function notranslate">
                                        <div class="lc">
                                            <strong class="searchOpts_title">검색조건</strong>
                                            <div class="grp">
                                                <span>제품군</span>
                                                <comp-checkbox-grp id="product" class="is-small" v-model="getProductFilter" :opts="getProductOpts" :allUnchkDisabled="true" :box="true"></comp-checkbox-grp>
                                            </div>
                                            <hr />
                                            <div class="grp">
                                                <span>사이트 구분</span>
                                                <comp-checkbox-grp id="site" class="is-small" v-model="getSiteFilter" :opts="getSiteOpts" :allUnchkDisabled="true" :box="true"></comp-checkbox-grp>
                                            </div>
                                            <hr />
                                            <div class="grp">
                                                <comp-selectbox id="type_select" class="is-small" v-model="brdOpts.search_type" :opts="getSearchTypeOpts"></comp-selectbox>
                                                <comp-input-box id="brd_searchKeyword" class="is-small" v-model="brdOpts.search_keyword" type="text" placeholder="검색 내용을 입력하세요." :forbiddenChars="searchForbiddenChars" @search="evt_click_search" @keyup="evt_enter_search" style="width: 500px; margin-left: 4px"></comp-input-box>
                                            </div>
                                            <hr />
                                            <div class="grp">
                                                <comp-button class="is-icon-only is-small" title="초기화" @click="evt_click_reset"><span class="icon">&#xe020;</span></comp-button>
                                                <comp-button class="is-color-black is-small" title="검색" @click="evt_click_search" style="margin-right: 12px !important"><span class="text">검색</span></comp-button>
                                            </div>
                                        </div>
                                        <div class="divider"></div>
                                        <!-- 선택 일괄적용  -->
                                        <div class="lc">
                                            <div class="grp">
                                                <span>mkt_name</span>
                                                <comp-input-mkt v-model="allApplyOpts.mkt_name" menu="register" :data="allApplyOpts" :multiRegister="true" :inquireLoading.sync="inquireLoading" @getProductInformation="getProductInformation"></comp-input-mkt>
                                            </div>
                                            <div class="grp">
                                                <span>RAM</span>
                                                <div class="ui-loader-container is-small" :class="{ 'is-loading': inquireLoading }">
                                                    <comp-input-ram v-model="allApplyOpts.ram" menu="register" :data="allApplyOpts" :multiRegister="true" :autoComplete="autoComplete.ram"></comp-input-ram>
                                                </div>
                                            </div>
                                            <div class="grp">
                                                <span>Dual_sim</span>
                                                <div class="ui-loader-container is-small" :class="{ 'is-loading': inquireLoading }">
                                                    <comp-input-sim v-model="allApplyOpts.dual_sim" menu="register" :data="allApplyOpts" :multiRegister="true" :autoComplete="autoComplete.dual_sim" :dualSimList="dualSimListOnlyName"></comp-input-sim>
                                                </div>
                                            </div>
                                            <hr />
                                            <comp-button class="is-small" :disabled="getAllApplyBtnDisabled" @click="hndlAllApply"
                                                ><span class="txt">선택({{ checkedItems.length }}개) 일괄적용</span></comp-button
                                            >
                                        </div>
                                        <!-- // 선택 일괄적용  -->
                                        <div class="rc">
                                            <comp-pagination v-model="brdOpts.page_num" :row_limit="brdOpts.row_limit" :total-len="brdDatas.total_cnt"></comp-pagination>
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
                                            <hr />
                                            <comp-button v-if="getDevMode" class="is-color-black is-small" title="자동저장" @click="evt_autoSave"><span class="text">자동저장(개발전용)</span></comp-button>
                                            <comp-button class="is-color-black is-small" title="일괄저장" @click="evt_allItemSave"><span class="text">일괄저장</span></comp-button>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="ui_brd custom-style">
                                            <div class="wrap">
                                                <table>
                                                    <colgroup>
                                                        <col style="width: 50px" />
                                                        <col v-if="getColOpts.seq" style="width: 100px" />
                                                        <col v-if="getColOpts.site_name" style="width: 200px" />
                                                        <col v-if="getColOpts.title" style="width: 40%" />
                                                        <col v-if="getColOpts.memory" style="width: 100px" />
                                                        <col v-if="getColOpts.mkt_name" style="width: 30%" />
                                                        <col v-if="getColOpts.RAM" style="width: 100px" />
                                                        <col v-if="getColOpts.dual_sim" style="width: 100px" />
                                                        <col v-if="getColOpts.WON" style="width: 110px" />
                                                        <col v-if="getColOpts.regdate" style="width: 100px" />
                                                    </colgroup>
                                                    <thead class="notranslate" :class="{ 'is-lnb': getUseageLNB }">
                                                        <tr>
                                                            <th>
                                                                <comp-checkbox ref="allSelectedItem" id="register_allCheck" class="is-small is-board" v-model="allCheck" @click="clickAllCheck"> </comp-checkbox>
                                                            </th>
                                                            <th v-if="getColOpts.seq">
                                                                <strong>seq</strong>
                                                                <comp-table-sort id="AA.pm_seq" name="orderColumn" v-model="getBrdSort" :min-one-value="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.site_name">
                                                                <strong>site_name<br />country<br />brand</strong>
                                                                <comp-table-sort id="AA.site_name" name="orderColumn" v-model="getBrdSort" :min-one-value="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.title">
                                                                <strong>title<br />site_url</strong>
                                                                <comp-table-sort id="AA.d_title" name="orderColumn" v-model="getBrdSort" :min-one-value="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.memory">
                                                                <strong>memory</strong>
                                                                <col v-if="getColOpts.title" style="width: 40%" />
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
                                                            <th v-if="getColOpts.WON">
                                                                <strong>WON<br />RPA</strong>
                                                                <comp-table-sort id="cast(AA.retail_price_actual as unsigned)" name="orderColumn" v-model="getBrdSort" :min-one-value="false"></comp-table-sort>
                                                            </th>
                                                            <th v-if="getColOpts.regdate">
                                                                <strong>마스터<br />등록일</strong>
                                                                <comp-table-sort id="AA.reg_date" name="orderColumn" v-model="getBrdSort" :min-one-value="false"></comp-table-sort>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <!-- 데이터 없는 경우 -->
                                                    <tbody v-if="brdDatas.list.length == 0">
                                                        <tr v-for="$idx in Math.floor((brdOpts.row_limit - 1) / 2)" v-bind:key="`empty_t${$idx}`" class="is-no-over">
                                                            <td :colspan="getColCnt"></td>
                                                        </tr>
                                                        <tr class="is-no-over">
                                                            <td class="no_over no_data in_list" :colspan="getColCnt">
                                                                <span class="ui_no_data_txt">데이터가 없습니다.</span>
                                                            </td>
                                                        </tr>
                                                        <tr v-for="$idx in Math.ceil((brdOpts.row_limit - 1) / 2)" v-bind:key="`empty_b${$idx}`" class="is-no-over">
                                                            <td :colspan="getColCnt"></td>
                                                        </tr>
                                                    </tbody>
                                                    <!-- // 데이터 없는 경우 -->

                                                    <!-- 데이터 있는 경우 -->
                                                    <tbody v-else>
                                                        <template v-for="(item, $idx) in brdDatas.list">
                                                            <comp-table-row :key="`tr_${$idx}`" :brdData="brdDatas.list[$idx]" :col-opts="getColOpts" :dual-sim-list="dualSimListOnlyName" :checkedItem.sync="checkedItems" @updateRowData="getRowData" @allSave="evt_allItemSave"></comp-table-row>
                                                        </template>
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

            <!-- <div ref="tmpLog" v-html="tmpLogs" style="position: fixed; bottom: 0; right: 0; width: 900px; height: 500px; overflow: auto; background: #000; color: #fff"></div> -->
        </main>
    </div>
</template>

<script>
import { setItemLocalStorage, getItemLocalStorage } from '@shared/utils/localStorage';
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import EventBus from '@shared/utils/eventBus';
import { merge } from 'lodash';

import CompTableRow from './components/CompTableRow';

import CompInputMkt from '@/components/input/CompInputMkt';
import CompInputRAM from '@/components/input/CompInputRAM';
import CompInputSIM from '@/components/input/CompInputSIM';
import CompPagination from '@/components/pagination';
import store from '@/store';
import { API_datalist } from '@/api/register/datalist';
import { API_regist, API_regist_A } from '@/api/register/regist';

export default {
    name: 'Common-layout',
    data() {
        return {
            loading: false,
            apiUID: uuid.v4(),
            brdOpts: {
                row_limit: 100, // 게시판 Row
                page_num: 1, // 현재 페이지 번호
                search_type: '',
                search_keyword: '',
            },
            brdDatas: { total_cnt: 0, list: [] },
            allSaveDatas: null,
            allCheck: false,
            codeList: null,
            dualSimList: null,
            dualSimListOnlyName: null,
            allApplyOpts: { mkt_name: '', ram: '', dual_sim: '' },
            autoComplete: { ram: [], dual_sim: [] }, // 선택 일괄적용 ram,dual_sim 자동완성 목록
            checkedItems: [],
            searchForbiddenChars: ['"', "'"],

            // 개인화
            savePersonalization: {
                sec_register: {
                    data_list: {
                        // 항목설정
                        colOpts: {
                            seq: true,
                            site_name: true,
                            title: true,
                            memory: true,
                            mkt_name: true,
                            RAM: true,
                            dual_sim: true,
                            WON: true,
                            regdate: true,
                        },
                        // 검색조건
                        searchOpts: {
                            product: '1,2,3', // 제품군
                            site: '일반,브랜드,TCO,중고', // 사이트구분
                            search_type: 'title',
                            search_keyword: '',
                        },
                        // 게시판 정렬 (기본 정렬 : WON 내림차순)
                        brdSort: 'cast(AA.won as unsigned)^D',
                    },
                },
            },

            tmpLogs: '',
            inquireLoading: false, // 자동완성 조회시 로더
        };
    },
    components: {
        'comp-pagination': CompPagination,
        'comp-table-row': CompTableRow,
        'comp-input-mkt': CompInputMkt,
        'comp-input-ram': CompInputRAM,
        'comp-input-sim': CompInputSIM,
    },
    computed: {
        ...mapGetters(['getUseageLNB']),
        getDevMode() {
            return process.env.NODE_ENV == 'development';
        },
        getColOpts() {
            return this.savePersonalization.sec_register.data_list.colOpts;
        },

        getColCnt() {
            return Object.values(this.getColOpts).filter((val) => val).length + 1;
        },

        getProductOpts() {
            let opts = this.codeList?.getParseDatas({ name: '제품군' })[0]?.list || [];
            if (opts) opts.forEach((item) => (item.code = String(item.code)));
            return opts;
        },

        getSiteOpts() {
            return this.codeList?.getParseDatas({ name: '사이트 구분' })[0]?.list;
        },

        getSearchTypeOpts() {
            return this.codeList?.getParseDatas({ name: '검색어 구분' })[0]?.list || [];
        },

        getAllApplyBtnDisabled() {
            return !this.checkedItems.length || (!this.allApplyOpts.mkt_name.trim() && !this.allApplyOpts.ram.trim() && !this.allApplyOpts.dual_sim.trim());
        },

        getProductFilter: {
            get() {
                return this.savePersonalization.sec_register.data_list.searchOpts.product;
            },
            set(val) {
                this.savePersonalization.sec_register.data_list.searchOpts.product = val;
            },
        },

        getSiteFilter: {
            get() {
                return this.savePersonalization.sec_register.data_list.searchOpts.site;
            },
            set(val) {
                this.savePersonalization.sec_register.data_list.searchOpts.site = val;
            },
        },

        getBrdSort: {
            get() {
                return this.savePersonalization.sec_register.data_list.brdSort;
            },
            set(val) {
                this.savePersonalization.sec_register.data_list.brdSort = val;
                this.fetchData();
            },
        },

        getBrdSortName() {
            const sortName = this.getBrdSort.replace(/\^D|\^A/g, (match) => (match === '^D' ? ' DESC' : ' ASC'));
            let result = 'cast(AA.won as unsigned) DESC';
            if (sortName.indexOf('site_name') >= 0) {
                if (sortName.indexOf('DESC') >= 0) result = `${sortName},AA.country DESC,AA.brand DESC,cast(AA.won as unsigned) DESC`;
                if (sortName.indexOf('ASC') >= 0) result = `${sortName},AA.country ASC,AA.brand ASC,cast(AA.won as unsigned) DESC`;
            } else if (sortName.indexOf('title') >= 0) {
                if (sortName.indexOf('DESC') >= 0) result = `${sortName},AA.p_url DESC,cast(AA.won as unsigned) DESC`;
                if (sortName.indexOf('ASC') >= 0) result = `${sortName},AA.p_url ASC,cast(AA.won as unsigned) DESC`;
            } else {
                result = !this.getBrdSort || sortName === 'cast(AA.won as unsigned) DESC' ? 'cast(AA.won as unsigned) DESC' : `${sortName},cast(AA.won as unsigned) DESC`;
            }
            return result;
        },

        // 일괄 저장 api 에서 사용할 파라미터 데이터 파싱
        getParseAllSaveDatas() {
            const originDatas = structuredClone(this.allSaveDatas);
            // mkt_name,ram,sim 모두 저장된 데이터 x, 수정되거나 입력된 데이터가 없는 row 제거
            const removeSeq = originDatas.filter((item) => !item.MKT_NAME.trim().length && !item.RAM.trim().length && !item.DUAL_SIM.trim().length && !item.editMkt && !item.editRam && !item.editSim).map((item) => item.SEQ);

            const result = originDatas
                .filter((item) => !removeSeq.includes(item.SEQ))
                .map(({ SEQ, MKT_NAME, RAM, DUAL_SIM, SITE_URL, RPA, WON }) => ({
                    seq: SEQ,
                    mkt_name: MKT_NAME,
                    ram: RAM,
                    dual_sim: DUAL_SIM,
                    site_url: SITE_URL,
                    rpa: RPA,
                    won: WON,
                }));

            return result;
        },
    },
    beforeRouteEnter(from, to, next) {
        store
            .dispatch('opts/ATTRS', { codeSeq: '1,2,3,4,5,6' })
            .then((res) => {
                next((vm) => {
                    vm.codeList = res.data?.result;
                    vm.$store.commit('opts/SET_MKTLIST', res.data?.result.getParseDatas({ name: '제품 목록' })[0]?.list);
                    vm.dualSimList = res.data?.result.getParseDatas({ name: '듀얼심 목록' })[0]?.list;
                    vm.dualSimListOnlyName = vm.dualSimList.map((item) => item.name);
                });
            })
            .catch(($err) => {
                store
                    .dispatch('DIALOG_ERR', ['제품 정보를 로드하지 못했습니다.<br>확인을 누르시면 새로고침 됩니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.', '속성 로드 실패', 0])
                    .then(($val) => {
                        location.reload();
                    })
                    .catch(($err) => {
                        console.log('error');
                    });
            });
    },
    created() {
        // 개인화 적용
        const personalization = getItemLocalStorage('personalization');
        // this.savePersonalization = { ...this.savePersonalization, ...personalization?.register };
        /**
         * 5/29 memory 추가
         * es6의 스프래드 merge가 정상 작동 하지 않아, lodash의 merge로 교체
         */
        this.savePersonalization = merge(this.savePersonalization, personalization?.register);
        this.brdOpts.search_type = this.savePersonalization.sec_register.data_list.searchOpts.search_type;
        this.brdOpts.search_keyword = this.savePersonalization.sec_register.data_list.searchOpts.search_keyword;
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        checkedItems(val) {
            if (val.length === this.brdDatas.list.length) {
                this.allCheck = true;
            } else {
                this.allCheck = false;
            }
        },
        savePersonalization: {
            deep: true,
            handler(val) {
                const personalization = getItemLocalStorage('personalization');
                const savePersonalization = { ...personalization, register: val };
                setItemLocalStorage('personalization', savePersonalization);
            },
        },
        'brdOpts.page_num': {
            handler(val) {
                // 조건 변경 시 스크롤 상단으로 이동
                window.scrollTo(0, 0);
                this.checkedItems = [];
                this.fetchData();
            },
        },
    },
    methods: {
        /**
         * 일괄 저장
         * 6/28 일괄 저장 기능 추가
         */
        async evt_allItemSave() {
            const params = { list: [...this.getParseAllSaveDatas] };
            let failList = [];
            let successList = [];

            this.loading = true;
            await API_regist_A(this.apiUID, params)
                .then((res) => {
                    const result = structuredClone(res.data.result);
                    const failSeqList = result?.map((item) => item.seq);

                    failList = params.list.filter((item) => failSeqList.includes(item.seq));
                    successList = params.list.filter((item) => !failList.includes(item.seq));

                    const bindingItem = {
                        successList: structuredClone(successList),
                        failList: structuredClone(failList),
                    };

                    this.$emit('allSave_evt', bindingItem);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    if (failList?.length > 0) {
                        store.dispatch('DIALOG_ERR', [`${params.list.length}개의 제품 중 ${failList?.length}개의 제품 정보를 저장 하는데 실패하였습니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, '제품 등록 실패', 0]);
                    } else {
                        if (params.list.length) store.dispatch('NOTY_COM', `${params.list.length}개의 제품 정보가 저장 되었습니다.`);
                    }

                    this.loading = false;
                });
        },

        /**
         * 로우 데이터(mkt_name,ram,sim) 업데이트시, 일괄 저장 데이터 업데이트
         * @param {Object} data 로우 데이터
         */
        getRowData(data) {
            const updated = structuredClone(this.allSaveDatas);
            updated.forEach((item) => {
                if (item.SEQ === data.SEQ) Object.assign(item, data);
            });

            this.allSaveDatas = updated;
        },

        // 자동저장
        evt_autoSave() {
            EventBus.$emit('EVT_AUTOSAVE');
            setTimeout(() => {
                this.evt_allItemSave();
            }, 2000);
        },

        // 데이터 목록
        async fetchData() {
            this.loading = true;
            let params = {
                product_group: this.getProductFilter,
                site_type: this.getSiteFilter,
                page_num: this.brdOpts.page_num,
                rowLimit: this.brdOpts.row_limit,
                order_type: this.getBrdSortName,
            };
            if (this.brdOpts.search_keyword) params.sch_text = this.brdOpts.search_keyword;
            if (this.brdOpts.search_type) params.sch_option = this.brdOpts.search_type;

            await API_datalist(this.apiUID, params)
                .then((res) => {
                    let datas = JSON.parse(JSON.stringify(res.data.result));
                    this.brdDatas.total_cnt = datas?.total_cnt || 0;
                    this.brdDatas.list = datas?.list;
                    this.brdOpts.page_num = datas?.page_num || 1;
                    this.allSaveDatas = structuredClone(this.brdDatas.list);
                    // this.tmpLogs += this.brdDatas.list[0].TITLE + '   ||   ' + this.brdDatas.list[0].SITE_URL + '<br>';
                    // this.tmpLogs += this.brdDatas.list[1].TITLE + '   ||   ' + this.brdDatas.list[1].SITE_URL + '<br>';
                    // this.tmpLogs += '<br>';
                    // this.tmpLogs += this.brdDatas.list[this.brdDatas.list.length - 2].TITLE + '   ||   ' + this.brdDatas.list[this.brdDatas.list.length - 2].SITE_URL + '<br>';
                    // this.tmpLogs += this.brdDatas.list[this.brdDatas.list.length - 1].TITLE + '   ||   ' + this.brdDatas.list[this.brdDatas.list.length - 1].SITE_URL + '<br>';
                    // this.tmpLogs += '<br><br>-----------------------------------------------------------------<br><br>';

                    // setTimeout(() => {
                    //     this.$refs.tmpLog.scrollTop = 9999999;
                    // }, 0);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 제품정보조회 자동완성목록 적용
        getProductInformation(autoComplete) {
            this.autoComplete = structuredClone(autoComplete);

            // 항목 1개 : input 채우기
            if (this.autoComplete.ram.length === 1) {
                this.allApplyOpts.ram = this.autoComplete.ram[0].value;
            } else {
                this.allApplyOpts.ram = '';
            }

            if (this.autoComplete.dual_sim.length === 1) {
                this.allApplyOpts.dual_sim = this.autoComplete.dual_sim[0].value;
            } else {
                this.allApplyOpts.dual_sim = '';
            }
        },

        // 선택 일괄 적용
        async hndlAllApply() {
            const { mkt_name, ram, dual_sim } = this.allApplyOpts;
            let checkedList = structuredClone(this.checkedItems);
            let params = {};

            this.loading = true;
            const promises = checkedList.map(async (item, idx) => {
                this.brdDatas.list.forEach((data) => {
                    if (item === data.SEQ) {
                        params = {
                            seq: item,
                            site_url: data.SITE_URL,
                            rpa: data.RPA,
                            won: data.WON,
                        };
                        if (mkt_name.trim()) params.mkt_name = mkt_name;
                        if (ram.trim()) params.ram = ram;
                        if (dual_sim.trim()) params.dual_sim = dual_sim;
                    }
                });
                return await API_regist(this.apiUID + '_' + idx, params)
                    .then((res) => {
                        return { seq: item, data: res.data.result, inputData: structuredClone(this.allApplyOpts) };
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });

            let successList = [];
            let failList = [];
            await Promise.allSettled(promises)
                .then((res) => {
                    res.forEach((item) => {
                        if (!item.value) failList.push(item);
                        if (item.value?.data.msg === '성공') {
                            successList.push(item);
                            this.$emit('allApply_evt', item);
                        } else {
                            failList.push(item);
                            this.$emit('allApply_evt', item, 'failed');
                        }
                    });
                })
                .finally(() => {
                    if (failList.length > 0) {
                        store
                            .dispatch('DIALOG_ERR', [checkedList.length === failList.length ? `선택하신 ${checkedList.length}개의 제품 정보를 저장 하는데 실패하였습니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.` : `선택하신 ${checkedList.length}개의 제품 중 ${failList.length}개의 제품 정보를 저장 하는데 실패하였습니다.<br>문제가 지속 될 경우 관리자에게 문의하세요.`, '제품 등록 실패', 0])

                            .catch((err) => {
                                console.error(err);
                            });
                    } else {
                        store.dispatch('NOTY_COM', `선택하신 ${checkedList.length}개의 제품 정보가 저장 되었습니다.`);
                    }
                    this.allApplyOpts = { mkt_name: '', ram: '', dual_sim: '' };
                    this.autoComplete = { ram: [], dual_sim: [] };
                    this.checkedItems = [];
                    this.loading = false;
                });
        },

        // 전체 선택 체크박스 클릭
        clickAllCheck() {
            if (!this.allCheck) {
                this.checkedItems = this.brdDatas.list.arrObjAttrToStr('SEQ').strToArr();
            } else {
                this.checkedItems = [];
            }
        },

        // 검색 조건 초기화
        evt_click_reset() {
            const savePersonalization = this.savePersonalization.sec_register.data_list.searchOpts;
            savePersonalization.product = '1,2,3';
            savePersonalization.site = '일반,브랜드,TCO,중고';
            savePersonalization.search_type = 'title';
            savePersonalization.search_keyword = '';
            this.brdOpts.search_type = 'title';
            this.brdOpts.search_keyword = '';
            this.fetchData();
        },
        evt_enter_search(val) {
            this.evt_search();
        },
        evt_click_search(val) {
            this.evt_search();
        },
        evt_search() {
            const savePersonalization = this.savePersonalization.sec_register.data_list.searchOpts;
            savePersonalization.search_type = this.brdOpts.search_type;
            savePersonalization.search_keyword = this.brdOpts.search_keyword;
            this.brdOpts.page_num = 1;
            this.fetchData();
        },
    },
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
