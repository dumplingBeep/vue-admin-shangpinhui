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
};
