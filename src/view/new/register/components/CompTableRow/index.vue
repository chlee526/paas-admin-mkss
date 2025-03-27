<template>
    <tr :id="id" :class="{ 'is-active': usedSelected }">
        <td>
            <comp-checkbox ref="selectedItem" :id="usedItem.SEQ" class="is-small is-board" :value="usedItem.SEQ" v-model="usedSelected" tabindex="-1"></comp-checkbox>
        </td>
        <td v-if="colOpts.seq">
            <span class="notranslate">{{ usedItem.SEQ }}</span>
        </td>
        <td v-if="colOpts.site_name" class="ui_al ui-breakall-unset notranslate">
            <span v-html="usedItem.SITE_NAME"></span>
            <br />
            <strong v-html="usedItem.COUNTRY"></strong>
            <br />
            <span v-html="usedItem.BRAND"></span>
        </td>
        <td v-if="colOpts.title" class="ui_al is-keep-all">
            <comp-site-title-url :used-item="usedItem"></comp-site-title-url>

            <!-- <a :href="usedItem.SITE_URL.buzmsLink()" target="_blank" tabindex="-1">
                <span class="is-color-blue" v-html="usedItem.TITLE"></span>
                <br v-if="usedItem.TITLE && usedItem.SITE_URL" />
                <span class="is-color-blue" v-html="parseSiteUrl(usedItem.SITE_URL)"></span>
            </a> -->
        </td>

        <!-- 
            2024-05-28
            Memory 컬럼 추가
        -->
        <td v-if="colOpts.memory" class="is-keep-all">
            <span class="notranslate">{{ usedItem.MEMORY }}</span>
        </td>

        <td v-if="colOpts.mkt_name" class="notranslate" :class="{ 'is-complete': saved.mkt_name, 'is-warning': rejected.mkt || brdData.rejectMktName, 'is-edited': getIsEditedMkt }">
            <comp-input-mkt v-model="usedItem.MKT_NAME" :item="usedItem" menu="register" :saved-data="mkt" :inquireLoading.sync="inquireLoading" @registProduct="registProduct" @getProductInformation="getProductInformation" @tab="evt_tab"></comp-input-mkt>
        </td>
        <td v-if="colOpts.RAM" class="notranslate ui-loader-container is-small" :class="{ 'is-complete': saved.ram, 'is-warning': rejected.ram || brdData.rejectRam, 'is-edited': getIsEditedRam, 'is-loading': inquireLoading }">
            <comp-input-ram v-model="usedItem.RAM" :item="usedItem" menu="register" :saved-data="ram" :autoComplete="autoComplete.ram" @registProduct="registProduct" @tab="evt_tab"></comp-input-ram>
        </td>
        <td v-if="colOpts.dual_sim" class="notranslate ui-loader-container is-small" :class="{ 'is-complete': saved.dual_sim, 'is-warning': rejected.dual_sim || brdData.rejectDualSim, 'is-edited': getIsEditedDualSim, 'is-loading': inquireLoading }">
            <comp-input-sim v-model="usedItem.DUAL_SIM" :item="usedItem" menu="register" :saved-data="dual_sim" :autoComplete="autoComplete.dual_sim" :dualSimList="dualSimList" @registProduct="registProduct" @tab="evt_tab"></comp-input-sim>
        </td>
        <td v-if="colOpts.WON" class="ui_ar">
            <strong class="notranslate">{{ usedItem.WON }}</strong>
            <br />
            <span class="notranslate">{{ usedItem.RPA }}</span>
        </td>
        <td v-if="colOpts.regdate" class="is-keep-all">
            <span class="notranslate">{{ usedItem.REG_DATE }}</span>
        </td>
    </tr>
</template>

<script>
import EventBus from '@shared/utils/eventBus';

import CompSiteTitleUrl from '@/components/site_title_url';
import { parseSiteUrl } from '@/utils';
import CompInputMkt from '@/components/input/CompInputMkt';
import CompInputRAM from '@/components/input/CompInputRAM';
import CompInputSIM from '@/components/input/CompInputSIM';

export default {
    name: 'comp-table-row',

    data() {
        return {
            tmpValue: '',
            usedItem: JSON.parse(JSON.stringify(this.brdData)),
            mkt: this.brdData.MKT_NAME,
            ram: this.brdData.RAM,
            dual_sim: this.brdData.DUAL_SIM,
            saved: {
                mkt_name: this.brdData.MKT_NAME.length,
                ram: this.brdData.RAM.length,
                dual_sim: this.brdData.DUAL_SIM.length,
            },
            rejected: {
                mkt: false,
                ram: false,
                dual_sim: false,
            },
            autoComplete: { ram: [], dual_sim: [] }, // 게시판 ram,dual_sim 자동완성 목록
            inquireLoading: false, // mkt_name 자동완성 조회 로딩
        };
    },
    components: {
        'comp-input-mkt': CompInputMkt,
        'comp-input-ram': CompInputRAM,
        'comp-input-sim': CompInputSIM,
        'comp-site-title-url': CompSiteTitleUrl,
    },
    props: {
        id: {},
        brdData: {},
        colOpts: {},
        dualSimList: {},
        checkedItem: {},
    },

    computed: {
        usedSelected: {
            get() {
                return this.checkedItem.includes(this.usedItem.SEQ);
            },
            set(val) {
                let result = JSON.parse(JSON.stringify(this.checkedItem));
                if (!result.includes(this.usedItem.SEQ)) {
                    result = result.addItem(this.usedItem.SEQ);
                } else {
                    result = result.removeItem(this.usedItem.SEQ);
                }
                this.$emit('update:checkedItem', result);
            },
        },
        getIsEditedMkt() {
            return this.saved.mkt_name && this.usedItem?.MKT_NAME != this.mkt && !this.rejected.mkt && !this.brdData.rejectMktName;
        },
        getIsEditedRam() {
            return this.saved.ram && this.usedItem?.RAM != this.ram && !this.rejected.ram && !this.brdData.rejectRam;
        },
        getIsEditedDualSim() {
            return this.saved.dual_sim && this.usedItem?.DUAL_SIM != this.dual_sim && !this.rejected.dual_sim && !this.brdData.rejectDualSim;
        },
    },

    mounted() {
        EventBus.$on('EVT_AUTOSAVE', this.evt_autoSave);
        this.$parent.$on('allApply_evt', this.setAllApply);
        this.$parent.$on('allSave_evt', this.setAllSave);
    },

    beforeDestroy() {
        this.$parent.$off('allApply_evt', this.setAllApply);
        this.$parent.$off('allSave_evt', this.setAllSave);
    },

    watch: {
        brdData: {
            deep: true,
            handler(val) {
                this.usedItem = JSON.parse(JSON.stringify(this.brdData));
                this.mkt = this.brdData.MKT_NAME;
                this.ram = this.brdData.RAM;
                this.dual_sim = this.brdData.DUAL_SIM;
                this.saved = {
                    mkt_name: this.brdData.MKT_NAME.length,
                    ram: this.brdData.RAM.length,
                    dual_sim: this.brdData.DUAL_SIM.length,
                };
                this.rejected = {
                    mkt: false,
                    ram: false,
                    dual_sim: false,
                };

                this.autoComplete = { ram: null, dual_sim: null };
            },
        },
        usedItem: {
            deep: true,
            handler(val) {
                // 로우데이터 업데이트시 상위에 전달(일괄 저장을 위함)
                let rowData = structuredClone(val);
                Object.assign(rowData, {
                    editMkt: this.getIsEditedMkt,
                    editRam: this.getIsEditedRam,
                    editSim: this.getIsEditedDualSim,
                });
                this.$emit('updateRowData', rowData);
            },
        },
    },

    methods: {
        // 자동저장
        evt_autoSave() {
            let el = this.$el.querySelectorAll('td')[3].querySelector('a > span:first-child');
            this.usedItem.MKT_NAME = el.innerText.replaceAll(/[\',|@#$%^*\[\]()\{\}‘’<>"\+-.\/:=\?_`´~§±·/]/g, '').substr(0, 50);
            this.usedItem.RAM = parseInt(Math.random() * 5) + '';
            this.usedItem.DUAL_SIM = 'Y';
        },

        // 제품등록결과 처리(target:저장대상, result: 저장 결과)
        parseSiteUrl,
        registProduct(target, result) {
            const { msg } = result;
            if (msg === '성공') {
                this.saved[target] = true;

                // 값이 있을 때만 해당 저장대상 적용
                if (target === 'mkt_name') {
                    this.mkt = this.usedItem.MKT_NAME;
                    this.rejected.mkt = false;
                }
                if (target === 'ram') {
                    this.ram = this.usedItem.RAM;
                    this.rejected.ram = false;
                }
                if (target === 'dual_sim') {
                    this.dual_sim = this.usedItem.DUAL_SIM;
                    this.rejected.dual_sim = false;
                }
            } else {
                if (target === 'mkt_name') this.rejected.mkt = true;
                if (target === 'ram') this.rejected.ram = true;
                if (target === 'dual_sim') this.rejected.dual_sim = true;
            }
        },

        // 제품정보조회 자동완성목록 적용
        getProductInformation(autoComplete) {
            this.autoComplete = structuredClone(autoComplete);
            // 항목 1개 : input 채우기
            if (this.autoComplete.ram.length === 1) {
                this.usedItem.RAM = this.autoComplete.ram[0].value;
            } else {
                this.usedItem.RAM = '';
            }

            if (this.autoComplete.dual_sim.length === 1) {
                this.usedItem.DUAL_SIM = this.autoComplete.dual_sim[0].value;
            } else {
                this.usedItem.DUAL_SIM = '';
            }
        },

        // 선택 일괄적용시 데이터 값 변경
        setAllApply(result, failed) {
            const inputMkt = result.value.inputData.mkt_name;
            const inputRam = result.value.inputData.ram;
            const inputDualSim = result.value.inputData.dual_sim;
            // 저잗 성공
            if (result.value.seq === this.brdData.SEQ && !failed) {
                if (inputMkt.trim().length) {
                    this.mkt = inputMkt;
                    this.usedItem.MKT_NAME = inputMkt;
                    this.saved.mkt_name = true;
                    this.rejected.mkt = false;
                }
                if (inputRam.trim().length) {
                    this.ram = inputRam;
                    this.usedItem.RAM = inputRam;
                    this.saved.ram = true;
                    this.rejected.ram = false;
                }
                if (inputDualSim.trim().length) {
                    this.dual_sim = inputDualSim;
                    this.usedItem.DUAL_SIM = result.value.inputData.dual_sim;
                    this.saved.dual_sim = true;
                    this.rejected.dual_sim = false;
                }
            }
            // 저장 실패
            if (result.value.seq === this.brdData.SEQ && failed) {
                if (inputMkt.trim().length) {
                    this.usedItem.MKT_NAME = inputMkt;
                    this.rejected.mkt = true;
                }
                if (inputRam.trim().length) {
                    this.usedItem.RAM = inputRam;
                    this.rejected.ram = true;
                }
                if (inputDualSim.trim().length) {
                    this.usedItem.DUAL_SIM = inputDualSim;
                    this.rejected.dual_sim = true;
                }
            }
        },

        // 일괄 저장시 데이터 값 변경
        setAllSave(data) {
            const updateItem = (item, isSuccess) => {
                if (item.seq === this.brdData.SEQ) {
                    if (item.mkt_name.trim().length) {
                        this.mkt = isSuccess ? item.mkt_name : this.mkt;
                        this.usedItem.MKT_NAME = item.mkt_name;
                        this.saved.mkt_name = isSuccess;
                        this.rejected.mkt = !isSuccess;
                    }

                    if (item.ram.trim().length) {
                        this.ram = isSuccess ? item.ram : this.ram;
                        this.usedItem.RAM = item.ram;
                        this.saved.ram = isSuccess;
                        this.rejected.ram = !isSuccess;
                    }

                    if (item.dual_sim.trim().length) {
                        this.dual_sim = isSuccess ? item.dual_sim : this.dual_sim;
                        this.usedItem.DUAL_SIM = item.dual_sim;
                        this.saved.dual_sim = isSuccess;
                        this.rejected.dual_sim = !isSuccess;
                    }
                }
            };

            data.successList?.forEach((item) => updateItem(item, true));
            data.failList?.forEach((item) => updateItem(item, false));
        },

        /**
         * keydown.tab 이벤트 전달
         * @param {$event} e
         */
        evt_tab(e) {
            this.$emit('tab', e);
        },
    },
};
</script>

<style src="../../style.scss" lang="scss" scoped></style>
