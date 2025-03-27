import request from '@shared/utils/request';
import { getCommonApiValidation } from '@/api/validation';

// 제품 초기화
export function API_reset(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'RR', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('최종검수', data),
    });
}
