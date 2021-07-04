import request from './../../utils/request';

export default {
  // 获取所有品牌数据
  reqGetTrademarkList() {
    return request({
      method: 'GET',
      url: '/admin/product/baseTrademark/getTrademarkList',
    });
  },
  // 请求指定页、条数品牌数据
  reqGetPageTrademarkList(page, limit) {
    return request({
      method: 'GET',
      url: `/admin/product/baseTrademark/${page}/${limit}`,
    });
  },
  // 请求添加品牌
  reqAddTrademark(data) {
    return request({
      method: 'POST',
      url: '/admin/product/baseTrademark/save',
      data,
    });
  },
};
