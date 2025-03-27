<template>
    <comp-input-box :id="!multiRegister ? `RAM_${item?.SEQ}` : 'ram_multi'" class="is-small" v-model="result" :class="{ 'is-custom-border-color': autoComplete?.length }" :autocomplete="autoComplete?.length > 0 ? autoComplete : null" focusResetVisible @tab="evt_tab" @blur="blurRAM" :style="getComputedStyle"></comp-input-box>
</template>

<script>
import { uuid } from 'vue-uuid';

import { API_regist as API_regist_register } from '@/api/register/regist';
import { API_regist as API_regist_inspection } from '@/api/inspection/regist';
import { ValidationRam } from '@/utils';

export default {
    name: 'comp-input-ram',
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
        autoComplete: { type: Array },
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
        getComputedStyle() {
            return this.multiRegister ? { width: '80px' } : { width: '100%' };
        },
    },
    methods: {
        async registProduct() {
            if (this.multiRegister) return;
            let result = {};
            const { SEQ, RESULT_RAM, SITE_URL, RPA, WON, RAM } = this.item;

            // DB저장된 값과 현재 value 같으면 저장 x
            if (this.menu === 'inspection' && (!RESULT_RAM || RESULT_RAM === this.savedData)) return;
            if (this.menu === 'register' && (!RAM || RAM === this.savedData)) return;

            let params = {};
            if (this.menu === 'inspection') {
                params = {
                    seq: SEQ,
                    ram: RESULT_RAM,
                };
            }
            if (this.menu === 'register') {
                params = {
                    seq: SEQ,
                    site_url: SITE_URL,
                    rpa: RPA,
                    won: WON,
                    ram: RAM,
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
                    this.$emit('registProduct', 'ram', result);
                });
        },

        // 입력 값이 실수 또는 Q인지 확인 후 실수로 변경
        blurRAM() {
            if (this.menu === 'inspection') {
                this.result = ValidationRam(this.item.RESULT_RAM);
            }
            if (this.menu === 'register') {
                if (this.multiRegister) {
                    this.result = ValidationRam(this.data.ram);
                } else {
                    this.result = ValidationRam(this.item.RAM);
                }
            }
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
