import request from '@shared/utils/request';

// 제품정보 조회
export function API_inquire(id, param) {
    let path = process.env.VUE_APP_BASE_API + '/api/';
    const data = { cmd: 'PG', ...param };

    return request({
        id: id,
        url: path,
        method: 'post',
        data: data,
    });
}
