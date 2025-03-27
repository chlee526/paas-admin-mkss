import store from '@/store';

import opts from '@shared/store/modules/opts';

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * State
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

opts.state.mktList = [];

const defaultMktList = [
    { code: '삭제_가비지', name: '삭제_가비지' },
    { code: '삭제_미취급브랜드', name: '삭제_미취급브랜드' },
    { code: '삭제_결합상품', name: '삭제_결합상품' },
    { code: '삭제_중고', name: '삭제_중고' },
    { code: '보류_수집오류', name: '보류_수집오류' },
    { code: '보류_모델명', name: '보류_모델명' },
    { code: '보류_접속불가', name: '보류_접속불가' },
    { code: '보류_정보없음', name: '보류_정보없음' },
    { code: '보류_GSM없음', name: '보류_GSM없음' },
];

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Mutation
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
opts.mutations.SET_MKTLIST = function (state, val) {
    state.mktList = [...val, ...defaultMktList];
};

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Action
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const actions = {};

export default opts;
