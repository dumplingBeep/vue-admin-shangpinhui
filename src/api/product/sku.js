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

  // POST /admin/product/saveSkuInfo
  // POST /admin/product/updateSkuInfo
  reqAddOrUpdate(skuInfo) {
    return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`, skuInfo);
  },

  // GET /admin/product/findBySpuId/{spuId}
  reqGetSkuList(spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`);
  },

  /* 
  根据SKU的id查询SKU的详细信息
  GET /admin/product/getSkuById/{skuId}
  */
  reqGetSkuDetail(skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`);
  },

  // DELETE /admin/product/deleteSku/{skuId}
  reqDeleteSku(skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`);
  },

  // GET /admin/product/inner/findSkuInfoByKeyword/{keyword}
  reqSearchSku(keyword) {
    return request.get(`/admin/product/inner/findSkuInfoByKeyword/${keyword}`);
  },
};
