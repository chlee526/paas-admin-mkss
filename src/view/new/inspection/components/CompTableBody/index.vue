<template>
    <tbody v-if="item">
        <tr :class="{ 'is-active': isChecked }">
            <td rowspan="2">
                <comp-checkbox :id="`${id}_${item.SEQ}`" class="is-small is-board" :value="isChecked" @click="clickCheckBox" tabindex="-1"></comp-checkbox>
            </td>
            <td v-if="colOpts.seq" rowspan="2">
                <span class="notranslate">{{ item.SEQ }}</span>
            </td>
            <td v-if="colOpts.title" class="ui_al ui-breakall-unset" rowspan="2">
                <comp-site-title-url :used-item="item" isInspection></comp-site-title-url>
                <!-- <a :href="item.SITE_URL.buzmsLink()" target="_blank" tabindex="-1">
                    <strong v-html="item.TITLE"></strong>
                    <br v-if="item.TITLE && item.SITE_URL" />
                    <span class="is-color-blue" v-html="parseSiteUrl(item.SITE_URL)"></span>
                </a> -->
            </td>
            <td v-if="colOpts.mkt_name" class="ui_al is-keep-all notranslate">
                <span v-html="item.MKT_NAME1"></span>
            </td>
            <td v-if="colOpts.RAM" class="notranslate" :class="{ 'is-warning': item.RAM1 !== item.RAM2 }">
                <span>{{ item.RAM1 }}</span>
            </td>
            <td v-if="colOpts.dual_sim" class="notranslate" :class="{ 'is-warning': item.DUAL_SIM1 !== item.DUAL_SIM2 }">
                <span>{{ item.DUAL_SIM1 }}</span>
            </td>

            <td
                v-if="colOpts.mkt_name_final"
                rowspan="2"
                class="notranslate"
                :class="{
                    'is-warning': isWarning('mkt_name'),
                    'is-complete': result.mkt_name,
                    'is-edited': isEdited('mkt_name'),
                }">
                <comp-input-mkt v-model="item.RESULT_MKT_NAME" :item="item" menu="inspection" :saved-data="saved.mkt_name" @registProduct="registProduct" @getProductInformation="getProductInformation"></comp-input-mkt>
            </td>
            <td
                v-if="colOpts.RAM_final"
                class="notranslate"
                :class="{
                    'is-warning': isWarning('ram'),
                    'is-complete': result.ram,
                    'is-edited': isEdited('ram'),
                }"
                rowspan="2">
                <comp-input-ram v-model="item.RESULT_RAM" :item="item" :autoComplete="autoComplete.ram" menu="inspection" :saved-data="saved.ram" @registProduct="registProduct"></comp-input-ram>
            </td>
            <td
                v-if="colOpts.dual_sim_final"
                class="notranslate"
                :class="{
                    'is-warning': isWarning('dual_sim'),
                    'is-complete': result.dual_sim,
                    'is-edited': isEdited('dual_sim'),
                }"
                rowspan="2">
                <comp-input-sim v-model="item.RESULT_DUAL_SIM" :item="item" :autoComplete="autoComplete.dual_sim" :dualSimList="dualSimList" menu="inspection" :saved-data="saved.dual_sim" @registProduct="registProduct"></comp-input-sim>
            </td>
            <td v-if="colOpts.WON" class="ui_ar" rowspan="2">
                <strong class="notranslate">{{ item.WON }}</strong>
                <br />
                <span class="notranslate">{{ item.RPA }}</span>
            </td>
            <td v-if="colOpts.regdate" rowspan="2">
                <span class="notranslate">{{ new Date().dateToStr() }}</span>
            </td>
        </tr>
        <tr class="is-no-padding notranslate" :class="{ 'is-active': isChecked }">
            <td v-if="colOpts.mkt_name" class="ui_al is-keep-all">
                <span>{{ item.MKT_NAME2 }}</span>
            </td>
            <td v-if="colOpts.RAM" :class="{ 'is-warning': item.RAM1 !== item.RAM2 }">
                <span>{{ item.RAM2 }}</span>
            </td>
            <td v-if="colOpts.dual_sim" :class="{ 'is-warning': item.DUAL_SIM1 !== item.DUAL_SIM2 }">
                <span>{{ item.DUAL_SIM2 }}</span>
            </td>
        </tr>
    </tbody>
</template>

<script>
import { uuid } from 'vue-uuid';

import CompInputMkt from '@/components/input/CompInputMkt';
import CompInputRAM from '@/components/input/CompInputRAM';
import CompInputSIM from '@/components/input/CompInputSIM';
import CompSiteTitleUrl from '@/components/site_title_url';
import { parseSiteUrl } from '@/utils';

export default {
    name: 'comp-table-body',

    data() {
        return {
            apiUID: uuid.v4(),
            item: structuredClone(this.brdData),
            result: {
                mkt_name: null,
                ram: null,
                dual_sim: null,
            },
            saved: {
                mkt_name: this.brdData.RESULT_MKT_NAME,
                ram: this.brdData.RESULT_RAM,
                dual_sim: this.brdData.RESULT_DUAL_SIM,
            },
            autoComplete: {
                ram: [],
                dual_sim: [],
            },
            isChecked: false,
        };
    },
    props: {
        id: {},
        brdData: { type: Object },
        colOpts: { type: Object },
        dualSimList: { type: Array },
        checkedItem: { type: Object },
    },
    components: {
        'comp-input-mkt': CompInputMkt,
        'comp-input-ram': CompInputRAM,
        'comp-input-sim': CompInputSIM,
        'comp-site-title-url': CompSiteTitleUrl,
    },
    computed: {
        getMktList() {
            return this.marketNameList;
        },
    },
    watch: {
        brdData: {
            deep: true,
            handler(val) {
                this.item = structuredClone(val);
            },
        },
        checkedItem: {
            deep: true,
            handler(val) {
                this.isChecked = val[this.item.SEQ];
            },
        },
    },

    methods: {
        // SiteUrl #뒷부분 강조표시
        parseSiteUrl,
        clickCheckBox() {
            this.$emit('clickCheckBox', this.item.SEQ);
        },

        // 제품등록결과 처리(target:저장대상, result: 저장 결과)
        registProduct(target, result) {
            const { RESULT_MKT_NAME, RESULT_RAM, RESULT_DUAL_SIM } = this.item;
            const { code } = result;
            const params = {};

            // 값이 있을 때만 해당 저장대상 적용
            if (target === 'mkt_name') {
                if (!RESULT_MKT_NAME) return;
                params.mkt_name = RESULT_MKT_NAME;
            }
            if (target === 'ram') {
                if (!RESULT_RAM) return;
                params.ram = RESULT_RAM;
            }
            if (target === 'dual_sim') {
                if (!RESULT_DUAL_SIM) return;
                params.dual_sim = RESULT_DUAL_SIM;
            }

            this.result[target] = code === 200 ? true : false;

            if (code === 200) {
                this.saved[target] = params[target];
            }
        },

        // 제품정보조회 자동완성목록 적용
        getProductInformation(autoComplete) {
            this.autoComplete = structuredClone(autoComplete);

            // 항목 1개 : input 채우기
            if (this.autoComplete.ram.length === 1) this.item.RESULT_RAM = this.autoComplete.ram[0].value;
            else this.item.RESULT_RAM = '';

            if (this.autoComplete.dual_sim.length === 1) this.item.RESULT_DUAL_SIM = this.autoComplete.dual_sim[0].value;
            else this.item.RESULT_DUAL_SIM = '';
        },

        isWarning(key) {
            const result = this.item[`${key.toUpperCase()}1`] !== this.item[`${key.toUpperCase()}2`] || (this.result[key] !== null && this.result[key] !== 200);
            return result;
        },
        isEdited(key) {
            const result = this.item[`RESULT_${key.toUpperCase()}`] != this.saved[key];
            return result;
        },
    },
};
</script>

<style src="../../style.scss" lang="scss" scoped></style>
