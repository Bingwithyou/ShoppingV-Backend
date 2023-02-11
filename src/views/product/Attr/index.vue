<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <Category-Select @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 表格：展示平台属性 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column prop="id" label="ID" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteExistAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
              ref="inputAttrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="isInputDone"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row }">
              <el-input
                ref="editInput"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.isShow"
                @blur="confirmInput(row)"
                @keyup.native.enter="row.isShow = false"
              ></el-input>
              <span
                style="display: block; height: 20px"
                v-else
                @click="editInput(row)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true" :disabled="isCancel"
          >取消</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true, // 切换显示表格
      isCancel: false, // 取消按钮
      isInputDone: false, // 添加属性值按钮
      // 新增/修改属性
      attrInfo: {
        attrName: "",
        attrValueList: [
          // 属性值，可以有多个因此用数组
          // {attrId: 0,valueName: "string",},
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3, // 服务器需要区分几级id
      },
    };
  },
  methods: {
    getCategoryId(categoryId) {
      this.category1Id = categoryId.category1Id;
      this.category2Id = categoryId.category2Id;
      this.category3Id = categoryId.category3Id;
      this.getAttrList();
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttrValue() {
      // 上次编辑未完成时不能新增输入
      if (this.isCancel == true) {
        this.$message("需要先完成当前输入");
      }
      // 输入为空时不能新增输入
      else if (this.attrInfo.attrName.trim() == "") {
        this.$message("属性名不能为空");
      } else {
        // 向属性值的数组里面添加元素
        this.attrInfo.attrValueList.push({
          attrId: undefined, // 目前操作还没有相应id，带给服务器undefined
          valueName: "", // 相应属性值名称
          isShow: true,
        });
        this.$nextTick(() => this.$refs.editInput.focus()); // 获取焦点
        this.isCancel = true; // 编辑时不能取消返回
      }
    },
    addAttr() {
      // 添加属性按钮的回调
      this.isShowTable = false;
      // 清空上次数据，并收集 3id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
      // 获取焦点
      this.$nextTick(() => this.$refs.inputAttrName.focus());
    },
    updateAttr(row) {
      // 修改attr回调
      this.isShowTable = false;
      // 将选择的属性赋值给attrInfo，
      // 当修改属性取消返回时，会发现属性值已经发生了更改，需要拷贝另一方数据操作解决
      // 由于数据结构中存在对象套数组，数组套对象，需要用深拷贝解决数据绑定指向问题
      this.attrInfo = cloneDeep(row);

      // 编辑时，遍历给每一项数据加上isShow控制切换
      this.attrInfo.attrValueList.forEach((item) => {
        // isShow不是响应式数据，直接更改不能更新视图，使用$set
        // item.isShow = false;
        this.$set(item, "isShow", false);
      });
    },
    deleteAttr($index) {
      // splice方法从索引值(鼠标点击的目标)开始，删除一个元素。最后保存时在发送请求
      this.attrInfo.attrValueList.splice($index, 1);
    },
    async deleteExistAttr(row) {
      // 整栏删除展示的Attr
      let attrId = row.attrValueList[0].attrId;
      let result = await this.$API.attr.reqDeleteAttr(attrId);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getAttrList();
      } else {
        this.$message({
          type: "warning",
          message: `删除失败，code: ${result.code}`,
        });
      }
    },
    editInput(row) {
      row.isShow = true;
      this.$nextTick(() => this.$refs.editInput.focus()); // 获取焦点
      this.isCancel = true; // 编辑时不能取消返回
      this.isInputDone = true; // 编辑时不能新增属性
    },
    confirmInput(row) {
      // 属性值不能重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // if先排除自身，和其他比较
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (row.valueName.trim() == "") {
        this.$message("属性值不能为空");
      } else if (isRepeat) {
        this.$message("属性值不能相同");
      } else {
        row.isShow = false;
        this.isCancel = false;
        this.isInputDone = false;
      }
    },
    async addOrUpdateAttr() {
      // 整理参数，属性值为空的不应提交给服务器，并且过滤无用字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.isShow;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList(); // 保存成功后再次获取平台属性展示
        this.isShowTable = true;
        this.isCancel = false;
      } catch (error) {
        console.warn(error);
      }
    },
  },
};
</script>

<style lang='less' scoped>
</style>