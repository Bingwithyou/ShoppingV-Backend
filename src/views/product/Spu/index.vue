<template>
  <div>
    <el-card style="margin: 20px 0">
      <Category-Select @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 会有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示 SPU 列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column prop="id" label="ID" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="编辑"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="信息"
                @click="showSkuInfo(row)"
              ></el-button>
              <el-popconfirm
                title="确认删除?"
                @onConfirm="deleteSpu(row)"
                style="margin-left: 10px"
                ><el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></el-button
              ></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="this.total / limit <= 1"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          style="text-align: center"
          layout="prev, pager, next, jumper, ->, sizes, total"
        ></el-pagination>
      </div>

      <!-- 对话框，显示 Sku 信息 -->
      <el-dialog
        :title="spu.spuName + '的Sku列表'"
        :visible.sync="dialogVisible"
        :before-close="handleBeforeClose"
      >
        <!-- loading 小问题需要解决(在 before-close 里调用回调)：
              1. loading 效果只有一次，因为设置为false之后没有再变化
              2. 快速切换查看 Sku 会看到上次的数据
         -->
        <el-table
          :data="skuList"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="skuName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="width">
          </el-table-column>
          <el-table-column prop="weight" label="重量" width="width">
          </el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt="sku default image"
                style="height: 100px; width: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 添加或修改SPU -->
      <Spu-Form v-show="scene == 1" @changeScene="changeScene" ref="spu" />

      <!-- 添加SKU -->
      <Sku-Form v-show="scene == 2" @changeScene="changeScene" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, // 分页器第几页
      limit: 5, // 每一页展示多少条数据
      total: 0,
      records: [], // spu 列表数据
      scene: 0, // 0：SPU列表数据  1：添加或修改SPU  2：添加SKU
      dialogVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    getCategoryId(categoryId) {
      // 把子组件相应id传递给父组件
      // 收到categoryId对象，包含一、二、三级分类的id
      this.category1Id = categoryId.category1Id;
      this.category2Id = categoryId.category2Id;
      this.category3Id = categoryId.category3Id;
      // 获取 SPU 数据列表进行展示
      this.getSpuList();
    },
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      } else {
        this.$message({
          type: "warning",
          message: `获取SPU数据失败, code: ${result.code}`,
        });
      }
    },
    handleCurrentChange(page) {
      // 获取某页数据，elementUI已经封装好会传来页码参数
      this.page = page;
      this.getSpuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      // 通知子组件spuForm发两个请求，将 category3Id 传递过去
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      // 每次点击编辑时，通过$refs获取子组件SpuForm，触发其身上的方法，初始化内容
      this.$refs.spu.initSpuData(row.id);
    },
    changeScene(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    async deleteSpu(row) {
      await this.$API.spu.reqDeleteSpu(row.id);
      this.$message.success("删除信息成功");
      // 删除后加载信息，如果当前页数据少于1，返回上一页
      this.page = this.records.length > 1 ? this.page : this.page - 1;
      this.getSpuList();
    },
    addSku(row) {
      this.scene = 2;
      // 调用子组件方法，发送三个请求初始化数据
      this.$refs.sku.initSkuData(this.category1Id, this.category2Id, row);
    },
    async showSkuInfo(row) {
      this.dialogVisible = true;
      this.spu = row;
      // 获取 Sku 列表数据
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.loading = false;
        this.skuList = result.data;
      }
    },
    handleBeforeClose(done) {
      this.loading = true;
      this.skuList = [];
      // 关闭对话框
      done();
    },
  },
};
</script>

<style lang='less' scoped>
</style>