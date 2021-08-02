import request from '@/utils/request';

export default {
    // GET /admin/product/{page}/{limit}
    getSpuList({ page, limit, category3Id }) {
        return request.get(`/admin/product/${page}/${limit}`, {
            params: {
                category3Id,
            },
        });
    },

    // GET /admin/product/getSpuById/{spuId}
    getSpuById(spuId) {
        return request.get(`/admin/product/getSpuById/${spuId}`);
    },

    // GET /admin/product/spuImageList/{spuId}
    getSpuImageList(spuId) {
        return request.get(`/admin/product/spuImageList/${spuId}`);
    },

    // GET /admin/product/baseSaleAttrList
    getBaseSaleAttrList(spuId) {
        return request.get('/admin/product/baseSaleAttrList');
    },

    // POST /admin/product/updateSpuInfo
    // POST /admin/product/saveSpuInfo
    saveSpuFormData(data) {
        return request.post(`/admin/product/${data.id ? 'update' : 'save'}SpuInfo`, data);
    },

    // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    getAttrList({ category1Id, category2Id, category3Id }) {
        return request.get(
            `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
        );
    },

    // GET /admin/product/spuSaleAttrList/{spuId}
    getSpuSaleAttrList(spuId) {
        return request.get(`/admin/product/spuSaleAttrList/${spuId}`);
    },

    // GET /admin/product/spuImageList/{spuId}
    getSpuImageList(spuId) {
        return request.get(`/admin/product/spuImageList/${spuId}`);
    },

    // POST /admin/product/saveSkuInfo
    saveSkuInfo(data) {
        return request.post('/admin/product/saveSkuInfo', data);
    },
};
