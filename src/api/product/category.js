import request from '@/utils/request';

export default {
  // 获取一级分类
  reqGetCategory1List() {
    return request({
      method: 'GET',
      url: '/admin/product/getCategory1',
    });
  },

  // 获取二级分类
  reqGetCategory2List(category2Id) {
    return request({
      method: 'GET',
      url: `/admin/product/getCategory2/${category2Id}`,
    });
  },

  // 获取三级分类
  reqGetCategory3List(category3Id) {
    return request({
      method: 'GET',
      url: `/admin/product/getCategory3/${category3Id}`,
    });
  },
};
