import request from './../../utils/request';

export default {
  // 请求指定页、条数品牌数据
  reqGetPageTrademarkList(page, limit) {
    return request({
      method: 'GET',
      url: `/admin/product/baseTrademark/${page}/${limit}`,
    });
  },
};
