// 四个模块接口的请求函数统一暴露
import * as trademark from "./tradeMark";
import * as attr from "./attr";
import * as spu from "./spu";
import * as sku from "./sku";

export default {
  trademark,
  attr,
  spu,
  sku,
};
