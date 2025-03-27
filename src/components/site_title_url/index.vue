<template>
    <a :href="'https://www.newen.ai/'" target="_blank" tabindex="-1">
        <span v-html="usedItem.TITLE" :style="getTitleStyle"></span>
        <br v-if="usedItem.TITLE && usedItem.SITE_URL" />
        <span v-html="getUrl"></span>
    </a>
</template>

<script>
import { parseSiteUrl } from '@/utils';

export default {
    name: 'comp-site',
    data() {
        return {};
    },
    props: {
        usedItem: {},
        isInspection: { type: Boolean, default: false },
    },
    computed: {
        getTitleStyle() {
            return this.isInspection ? 'color: #666;font-weight: bold;' : '';
        },
        getUrl() {
            return parseSiteUrl(this.usedItem.SITE_URL);
        },
    },
    watch: {
        usedItem: {
            deep: true,
            handler(val) {
                this.$forceUpdate();
            },
        },
    },
    methods: {
        parseSiteUrl() {},
    },
};
</script>

<style scoped>
span {
    color: #7487e5;
}
strong {
    color: #d54141;
}
</style>
