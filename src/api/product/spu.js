import request from "@/utils/request";

// 获取 SPU 列表数据
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });

// 获取某个 SPU 信息
export const reqSpuById = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });

// 获取品牌信息
export const reqTradeMarkList = () =>
  request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "get",
  });

// 获取某个 SPU 图片
export const reqSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

// 获取销售属性(最多三个)
export const reqBaseSaleAttrList = () =>
  request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });

// 修改或添加SPU，带id代表修改
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  } else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
};

// 删除 Spu
export const reqDeleteSpu = (spuId) =>
  request({
    url: `admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });

// 添加 Sku
export const reqAddSku = (skuInfo) =>
  request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });

// 获取 Sku 列表数据
export const reqSkuList = (spuId) =>
  request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });
