import request from '@/utils/request';

export default {
  // 获取产品列表
  reqGetProductList(page, limit) {
    return request({
      method: 'GET',
      url: `/admin/product/list/${page}/${limit}`,
    });
  },
};
