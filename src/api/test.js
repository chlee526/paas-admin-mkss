import request from '@shared/utils/request';
import { getCommonApiValidation } from '@/api/validation';

// 등록통계
export function API_datalist(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/?cmd=SG';

    return request({
        id: id,
        url: path,
        method: 'post',
        data: getCommonApiValidation('등록통계'),
    });
}
