import request from '@/utils/request';

export default {
  // 请求获取指定分类的属性信息列表
  reqGetAttrInfoList(category1Id, category2Id, category3Id) {
    return request({
      method: 'GET',
      url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    });
  },
};
