import request from '@/utils/request';

export default {
  // 请求指定页、条数品牌数据
  reqGetPageTrademarkList(page, limit) {
    return request({
      method: 'GET',
      url: `/admin/product/baseTrademark/${page}/${limit}`,
    });
  },
  // 请求添加/修改品牌
  reqAddOrUpdateTrademark(data) {
    if (data.id) {
      return request({
        method: 'PUT',
        url: '/admin/product/baseTrademark/update',
        data,
      });
    } else {
      return request({
        method: 'POST',
        url: '/admin/product/baseTrademark/save',
        data,
      });
    }
  },
  // 请求修改品牌
  reqDeleteTrademark(id) {
    return request({
      method: 'DELETE',
      url: `/admin/product/baseTrademark/remove/${id}`,
    });
  },
};
