import { getUserNo } from '@shared/utils/auth';
/**
 * 공통 API 유효성
 * @param {Object} menu 메뉴명(신규등록, 최종검수, 등록통계)
 * @param {Object} param 검증에 사용될 파라미터
 * @returns {Object} 검증이 완료된 파라미터
 */
export const getCommonApiValidation = (menu, param) => {
    return {
        SS_M_MENU: menu,
        user_no: getUserNo() || '',
        ...param,
    };
};
