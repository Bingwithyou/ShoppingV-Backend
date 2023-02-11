import request from "@/utils/request";

// export const reqSpuImageList=(spuId)=>request({url:``,method:''})

// 请求图片数据
export const reqSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

// 请求销售属性数据
export const reqSpuSaleAttrList = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

// 请求平台属性数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id} /${category3Id} `,
    method: "get",
  });

// sku 列表数据
export const reqSkuList = (page, limit) =>
  request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });

// 上架
export const reqOnSale = (skuId) =>
  request({ url: `/admin/product/onSale/${skuId}`, method: "get" });

// 下架
export const reqCancelSale = (skuId) =>
  request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" });

// 获取 Sku 详情
export const reqSkuById = (skuId) =>
  request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" });

// 删除 Sku
export const reqDeleteSku = (skuId) =>
  request({ url: `/admin/product/deleteSku/${skuId}`, method: "delete" });
