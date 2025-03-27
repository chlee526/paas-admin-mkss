import request from '@shared/utils/request';
import { getCommonApiValidation } from '@/api/validation';

// 데이터 목록
export function API_datalist(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'PL', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('신규 등록', data),
    });
}
