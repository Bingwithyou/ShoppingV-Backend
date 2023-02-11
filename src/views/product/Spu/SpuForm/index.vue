<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu" :rules="rules">
      <!-- item 会继承 label-width=80px 属性 -->
      <el-form-item label="Spu名称" prop="spuName">
        <el-input placeholder="输入Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="选择品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述" prop="description">
        <el-input
          type="textarea"
          rows="4"
          placeholder="输入描述信息"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <!-- 
          action: 上传图片地址
          list-type: 文件列表类型
          file-list: 图片列表，需要name和url字段：[{name:'', url:''}]
          on-preview: 图片预览触发
          on-remove: 图片移除触发
          on-success: 上传成功时触发，参数: response, file, fileList
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="spu image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input与button交替显示隐藏 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="$event.target.blur"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 添加时，用spu收集数据
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        // id: 0, // 新增spu不需要id
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      }, // 存储 Spu 信息属性
      tradeMarkList: [], // 品牌信息
      spuImageList: [], // 图片信息
      saleAttrList: [], // 销售属性
      attrIdAndAttrName: "", // 未选择的销售属性
      rules: {
        spuName: [
          {
            required: true,
            message: "请输入Spu名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        tmId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        description: [
          {
            required: true,
            message: "请输入描述信息",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    handleRemove(file, fileList) {
      // file是删除的图片，fileList删除图片后剩余的其他图片列表
      // 已有的图片手动添加了name,url字段用来展示图片
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      // 将图片地址传递给dialog进行放大展示，并将dialogVisible设为true展示出来
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initSpuData(spuId) {
      // 点击编辑时，初始化信息数据，需要发送共4个请求
      // 获取 Spu 信息
      let spuResult = await this.$API.spu.reqSpuById(spuId);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }

      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取 Spu 图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spuId);
      if (spuImageResult.code == 200) {
        this.spuImageList = spuImageResult.data;
        let imageList = spuImageResult.data;
        imageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imageList;
      }

      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handleSuccess(response, file, fileList) {
      // 收集图片上传信息
      this.spuImageList = fileList;
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空选择框的数据
      this.attrIdAndAttrName = "";
    },
    addSaleAttrValue(row) {
      // 添加属性值（标签）
      // true切换为输入框
      this.$set(row, "inputVisible", true);
      // 收集新增属性
      this.$set(row, "inputValue");

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 新增属性值不能为空 且 不能重复
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (inputValue == undefined || inputValue.trim() == "") {
        row.inputVisible = false;
      } else if (isRepeat) {
        this.$message.warning("属性值已存在");
      } else {
        let newSaleAttrValue = {
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        };
        row.spuSaleAttrValueList.push(newSaleAttrValue);
        row.inputVisible = false;
      }
    },
    async addOrUpdateSpu() {
      // 整理图片墙数据，新增图片没有imageName与imageUrl字段，所以进行补充
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        };
      });

      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message.success("保存成功");
      } else {
        this.$message.warning("保存失败, 错误信息: " + result.code);
      }
      this.$emit("changeScene", 0);
      // 清空上次数据
      Object.assign(this.$data, this.$options.data());
    },
    async addSpuData(category3Id) {
      // 点击添加SPU按钮时触发

      // 收集三级分类的id
      this.spu.category3Id = category3Id;

      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handleCancel() {
      this.$emit("changeScene", 0);
      // 清空上次数据, assign 是 ES6 新增方法可以合并对象
      // $option 为实例身上配置对象，_data 可以操作 data 当中响应式数据
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>