<template>
    <div class="ui_pagination">
        <button type="button" title="이전 페이지" :disabled="val == 1" @click.stop="evt_click('-')">
            <span class="icon">&#xe001;</span>
        </button>
        <span class="info">
            <strong class="current_page">{{ this.val }}</strong>
            <span class="ui_fc_dm2">/</span>
            <strong>{{ this.getTotalPageCnt }}</strong>
        </span>
        <button type="button" title="다음 페이지" :disabled="val == getTotalPageCnt || val == getPageLimit" @click.stop="evt_click('+')">
            <span class="icon">&#xe000;</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'comp-pagination',
    data() {
        return {
            maxLimitCnt: this.limitLen != undefined ? this.limitLen : 10000, // 최대 데이터 갯수
        };
    },
    props: {
        totalLen: { type: Number, require: true },
        row_limit: { type: Number, require: true },
        limitLen: { type: Number }, //최대 데이터 갯수
        value: { type: Number, require: true },
    },
    computed: {
        val: {
            get() {
                return Number(this.value);
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        getTotalPageCnt() {
            return this.totalLen > 0 ? Math.ceil(this.totalLen / this.row_limit) : 1;
        },
        getPageLimit() {
            return Math.ceil(Math.min(this.totalLen, this.maxLimitCnt) / this.row_limit);
        },
    },
    methods: {
        evt_click(val) {
            switch (val) {
                case '+': {
                    this.val += 1;
                    break;
                }
                case '-': {
                    this.val -= 1;
                    break;
                }
            }
        },
    },
};
</script>
<style src="./style.scss" lang="scss" scoped></style>
