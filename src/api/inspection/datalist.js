import request from '@shared/utils/request';
import { getCommonApiValidation } from '@/api/validation';

// 검수대상 제품 조회
export function API_datalist(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'RG', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('최종 검수', data),
    });
}
