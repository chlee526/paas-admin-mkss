import request from '@shared/utils/request';
import { getCommonApiValidation } from '@/api/validation';

// 검수 대상 수락
export function API_accept(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'RM', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('최종검수', data),
    });
}
