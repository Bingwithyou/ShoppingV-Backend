<template>
  <div>
    <!-- 
      inline: 行内表单，一个可以放置多个表单元素
      :model: 收集表单数据，el-form绑定cForm数据，el-option的value值传给el-select的v-model进行绑定
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- :values是:model获取的数据  -->
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            v-for="c1 in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            v-for="c2 in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            v-for="c3 in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handler1() {
      // 清除上次数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      // 一级分类option发生变化时获取相应二级分类数据
      const { category1Id } = this.cForm;
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      // 二级分类option发生变化时获取相应三级分类数据
      const { category2Id } = this.cForm;
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    handler3() {
      // 给父组件传递Id，通过自定义事件传递，this.$emit('func', params)
      const { category1Id, category2Id, category3Id } = this.cForm;
      let categoryId = { category1Id, category2Id, category3Id };
      this.$emit("getCategoryId", categoryId);
    },
  },
  mounted() {
    // 挂在完毕获取一级分类数据
    this.getCategory1List();
  },
};
</script>

<style lang='less' scoped>
</style>