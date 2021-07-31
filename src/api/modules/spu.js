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
};
