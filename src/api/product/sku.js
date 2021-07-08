import request from '@/utils/request';

export default {
  // 获取产品列表
  reqGetProductList(page, limit) {
    return request({
      method: 'GET',
      url: `/admin/product/list/${page}/${limit}`,
    });
  },

  // 上架商品
  reqOnSaleProduct(skuId) {
    return request({
      method: 'GET',
      url: `/admin/product/onSale/${skuId}`,
    });
  },

  // 下架商品
  reqCancelSaleProduct(skuId) {
    return request({
      method: 'GET',
      url: `/admin/product/cancelSale/${skuId}`,
    });
  },
};
