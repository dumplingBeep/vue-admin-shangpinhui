import request from '@/utils/request';

export default {
    // GET /admin/product/baseTrademark/getTrademarkList
    getTrademarkList() {
        return request.get('/admin/product/baseTrademark/getTrademarkList');
    },
};
