import Vue from 'vue';
import Router from 'vue-router';
import { fixRoutes, scrollBehaviorGetReroadChck } from '@shared/router'; // 고정 라우터

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * Router 등록/생성
 * 고정 라우터 목록
 * 404, 401, 로그인, 처음사용자 비밀번호 변경
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Vue.use(Router);

// 컨텐츠 라우터(메뉴구성)
export const contentRoutes = [
    {
        idx: 1,
        url: '/view/new/register',
        name: '신규 등록',
    },
    {
        idx: 2,
        url: '/view/new/inspection',
        name: '최종 검수',
        permissions: ['inspection_confirm', 'reset'],
    },
    {
        idx: 3,
        url: '/view/new/statistics',
        name: '등록 통계',
    },
];

// 최초 라우터 생성

// shared의 'fixRoutes'에 'contentRoutes'를 합쳐 App에서 사용할 route정보로 변환
contentRoutes.forEach(($item) => {
    let wrapComp = fixRoutes[fixRoutes.length - 1];

    if ($item.children) {
        const item = {
            path: $item.url,
            link: $item.link,
            name: $item.name,
            redirect: $item.children[0].url,
            meta: {
                auth: $item.meta ? $item.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
            },
        };
        if ($item.redirect) item.redirect = $item.redirect;
        wrapComp.children.push(item);

        $item.children.forEach(($subItem) => {
            const compName = $subItem.url.replace('/view/', '');
            const item2 = {
                path: $subItem.url,
                link: $subItem.link,
                name: $subItem.name,
                component: () => import(`@/view/${compName}`),
                meta: {
                    auth: $item.meta ? $item.meta.auth : $subItem.meta ? $subItem.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
                },
                beforeEnter: $subItem.beforeEnter,
            };
            wrapComp.children.push(item2);
        });
    } else {
        const compName = $item.url.replace('/view/', '');
        const item = {
            path: $item.url,
            link: $item.link,
            name: $item.name,
            component: () => import(`@/view/${compName}`),
            meta: {
                auth: $item.meta ? $item.meta.auth : process.env.NODE_ENV == 'development' ? true : false,
            },
            beforeEnter: $item.beforeEnter,
        };
        wrapComp.children.push(item);
    }
});

// 전역 Router 선언
let router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        /**
         * router 새로고침 시 이동 되는 scroll 위치와 다른 route로 이동 시 이동하는 스크롤 영역 return
         * savePosition은 이전 페이지 기록을 담는 param
         * 이후에 뒤로가기 시 스크롤 이동 처리 개발 된다면 수정 예정
         */
        return scrollBehaviorGetReroadChck(savedPosition);
    },

    routes: fixRoutes,
});

export default router;
