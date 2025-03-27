import request from '@shared/utils/request';

import { getCommonApiValidation } from '@/api/validation';

// 제품 등록
export function API_regist(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'PS', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('신규등록', data),
    });
}

// 제품 일괄 저장
export function API_regist_A(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'PA', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('신규등록', data),
    });
}
