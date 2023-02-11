<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="Spu名称"> {{ spu.spuName }}</el-form-item>
      <el-form-item label="Sku名称">
        <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量">
        <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="text-area"
          rows="4"
          placeholder="规格描述信息"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            v-for="attr in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" label="label" width="80px">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt="spu image"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // 收集sku的信息以便发送请求修改
      skuInfo: {
        // 父组件给的数据
        category3Id: "",
        spuId: "",
        tmId: "",
        // 通过v-model收集
        price: "",
        weight: "",
        skuName: "",
        skuDesc: "",
        // 需要自己书写代码
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: "",
          //   spuImg: "",
          // },
        ],
        skuAttrValueList: [
          // {
          //   attrId: "",
          //   attrName: "",
          //   id: "",
          //   skuId: "",
          //   valueId: "",
          //   valueName: "",
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: "",
          //   saleAttrId: "",
          //   saleAttrName: "",
          //   saleAttrValueId: "",
          //   saleAttrValueName: "",
          //   skuId: "",
          //   spuId: "",
          // },
        ],
      },
      // 服务器发来的数据
      spu: {},
      // 收集勾选图片数据字段
      imageList: [],
    };
  },
  methods: {
    async initSkuData(category1Id, category2Id, row) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;

      // 获取图片数据
      let imageResult = await this.$API.sku.reqSpuImageList(row.id);
      if (imageResult.code == 200) {
        // 给返回的图片数据加上 isDefault 字段
        let list = imageResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      } else {
        this.$message.error(
          `获取图片信息失败, ${imageResult.message} : ${imageResult.code}`
        );
      }

      // 获取销售属性
      let saleResult = await this.$API.sku.reqSpuSaleAttrList(row.id);
      if (saleResult.code == 200) {
        this.spuSaleAttrList = saleResult.data;
      } else {
        this.$message.error(
          `获取销售属性失败, ${saleResult.message} : ${saleResult.code}`
        );
      }

      // 获取平台属性
      let infoResult = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (infoResult.code == 200) {
        this.attrInfoList = infoResult.data;
      } else {
        this.$message.error(
          `获取平台属性失败, ${infoResult.message} : ${infoResult.code}`
        );
      }
    },
    handleSelectionChange(selection) {
      // 复选框选项回调，会将勾选的条目以数组形式传递过来
      // 当前收集的信息缺少 isDefault 字段
      this.imageList = selection;
    },
    changeDefault(row) {
      // 排他法，自身设为 1, 将其他图片的 isDefault 设为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScene", 0);
      Object.assign(this.$data, this.$options.data());
    },
    async saveSkuInfo() {
      // 整理参数
      const { attrInfoList, spuSaleAttrList, imageList, skuInfo } = this;

      // 一般方法：
      // let arr = [];
      // attrInfoList.forEach((item) => {
      //   // 选择框选中的元素
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(":");
      //     let obj = { valueId, attrId };
      //     arr.push(obj);
      //   }
      // });

      // 整理平台属性，然后赋值给 skuInfo
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        // 即：如果存在 attrIdAndValueId, 则将其分割然后以对象形式 push 进数组
        // 后边 [] 代表 prev 初始值为空数组
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);

      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        // 即：如果存在 attrIdAndValueId, 则将其分割然后以对象形式 push 进数组
        // 后边 [] 代表 prev 初始值为空数组
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      // 整理图片信息
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgeId: item.id,
        };
      });

      let result = await this.$API.spu.reqAddSku(this.skuInfo);
      if (result.code == 200) {
        this.$message.success("添加Sku成功");
        this.$emit("changeScene", 0);
      }
    },
  },
};
</script>

<style lang='less' scoped>
</style>