<template>
    <comp-input-box :id="!multiRegister ? `mkt_name_${item?.SEQ}` : 'mkt_name_multi'" class="is-small" v-model="result" focusResetVisible autocomplete="getMktList" @tab="evt_tab" @enter="getProductInformation" @change="getValidationMkt" @blur="getValidationMkt" style="width: 100%"></comp-input-box>
</template>

<script>
import { uuid } from 'vue-uuid';
import EventBus from '@shared/utils/eventBus';

import { API_regist as API_regist_register } from '@/api/register/regist';
import { API_regist as API_regist_inspection } from '@/api/inspection/regist';
import { API_inquire } from '@/api/inquire';
import { ValidationMkt } from '@/utils';

export default {
    name: 'comp-input-mkt',
    data() {
        return {
            apiUID: uuid.v4(),
        };
    },
    props: {
        item: { type: Object },
        menu: { type: String },
        multiRegister: { type: Boolean, default: false }, // 신규등록 선택일괄적용
        data: { type: Object }, // 신규등록 선택일괄적용 데이터
        savedData: { type: String }, //DB 저장된 값
        value: { type: String },
        inquireLoading: { type: Boolean },
    },
    computed: {
        result: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
    mounted() {
        // EventBus.$on('EVT_AUTOSAVE', this.evt_autoSave);
    },
    methods: {
        // 자동 저장
        evt_autoSave() {
            setTimeout(this.registProduct, Math.random() * 10000);
        },

        async registProduct() {
            if (this.multiRegister) return;
            let result = {};
            const { SEQ, RESULT_MKT_NAME, SITE_URL, RPA, WON, MKT_NAME } = this.item;

            // DB저장된 값과 현재 value 같으면 저장 x
            if (this.menu === 'inspection' && (!RESULT_MKT_NAME.trim() || RESULT_MKT_NAME === this.savedData)) return;
            if (this.menu === 'register' && (!MKT_NAME.trim() || MKT_NAME === this.savedData)) return;

            let params = {};
            if (this.menu === 'inspection') {
                params = {
                    seq: SEQ,
                    mkt_name: RESULT_MKT_NAME,
                };
            }
            if (this.menu === 'register') {
                params = {
                    seq: SEQ,
                    site_url: SITE_URL,
                    rpa: RPA,
                    won: WON,
                    mkt_name: MKT_NAME,
                };
            }

            let API;
            switch (this.menu) {
                case 'register':
                    API = API_regist_register;
                    break;
                case 'inspection':
                    API = API_regist_inspection;
                    break;
                default:
                    return;
            }

            // 짧은 시간 여러번 저장 API 요청시 apiUID 중복 이슈 발생 -> 랜덤 숫자를 추가해 중복 방지
            await API(this.apiUID + Math.random(), params)
                .then((res) => {
                    result = { ...res.data.result };

                    //DB 저장된 값 업데이트
                    this.originValue = this.item[this.keyName];

                    if (result.msg !== '성공') {
                        throw new Error();
                    }
                })
                .catch((err) => {
                    this.$store.dispatch('NOTY_ERR', '제품등록을 실패했습니다.');
                    console.error(err);
                })
                .finally(() => {
                    this.$emit('registProduct', 'mkt_name', result);
                });
        },

        // 제품정보조회 자동완성목록 불러오기
        async getProductInformation() {
            if (!this.multiRegister && this.menu === 'inspection' && !this.item?.RESULT_MKT_NAME.trim()) return;
            if (!this.multiRegister && this.menu === 'register' && !this.item?.MKT_NAME.trim()) return;
            if (this.multiRegister && this.menu === 'register' && !this.data.mkt_name.trim()) return;

            let params = {};
            if (!this.multiRegister) {
                params = {
                    site_name: this.item?.SITE_NAME || '',
                    mkt_name: this.item?.RESULT_MKT_NAME || this.item?.MKT_NAME,
                };
            } else {
                params = {
                    mkt_name: this.data.mkt_name,
                };
            }

            // 자동완성 목록
            const autoComplete = { ram: [], dual_sim: [] };
            this.$emit('update:inquireLoading', true);
            await API_inquire(this.apiUID, params)
                .then((res) => {
                    const { ram, dual_sim } = structuredClone(res.data.result);

                    if (ram?.length) {
                        autoComplete.ram = [...this.getRAMSIMParseData(ram)];
                    }
                    if (dual_sim?.length) {
                        autoComplete.dual_sim = [...this.getRAMSIMParseData(dual_sim)];
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.$emit('getProductInformation', autoComplete);
                    this.$emit('update:inquireLoading', false);
                });
        },

        // RAM/ SIM 자동완성용 파싱
        getRAMSIMParseData(datas) {
            return datas.map((data) => ({ code: Object.values(data)[0], value: Object.values(data)[0] }));
        },

        getValidationMkt() {
            this.result = ValidationMkt(this.result);
        },

        /**
         * keydown.tab 이벤트 전달, 제품등록
         * @param {$event} e
         */
        evt_tab(e) {
            if (!this.multiRegister) this.$emit('tab', e);
            this.registProduct();
        },
    },
};
</script>
