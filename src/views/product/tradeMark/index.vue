<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="
        dialogVisible = true;
        tmForm = { tmName: '', logoUrl: '' };
      "
      >添加</el-button
    >

    <!-- Table -->
    <!-- 
      表格组件（数据是一列一列进行展示）
      data: 要展示的数据(array数组类型数据)
      border: 边框
      label: 标题
      width: 对应列宽度
      align: 对其方式
      prop: 对应列内容的字段名
     -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column prop="id" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="LOGO" width="width">
        <!-- 固定写法，使用作用域插槽，子组件决定不了外观，父组件传给子数据，子通过插槽回传数据，父组件拿着渲染样式到插槽 -->
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            alt="logo image"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- slot-scope="{ row, $index }" -->
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>

    <!-- Dialog add -->
    <!-- 
      :visible.sync: 控制对话框显示与隐藏
      :model: 把表单数据收集到对象身上，表单验证也需要这个属性
    -->
    <el-dialog
      :title="tmForm.id ? '修改' : '添加'"
      :visible.sync="dialogVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" label-width="100px" prop="logoUrl">
          <!--
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" 
            action: 图片上传的地址，要加dev-api不然报404错误
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件, 且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, // 当前页数
      limit: 5, // 数据条数
      total: 0, // 总条数
      records: [], // 列表展示的数据
      dialogVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "", // 上传图片属性
      },
      // 表单验证规则，定义好后绑定el-form(:rules='rules')，将验证字段通过prop传入el-form-item
      rules: {
        tmName: [
          {
            required: true,
            message: "品牌名称不能为空",
            trigger: "blur",
          },
          { min: 2, max: 10, message: "长度2-10个字符", trigger: "blur" },
        ],
        logoUrl: [
          {
            required: true,
            message: "图片不能为空",
          },
        ],
      },
    };
  },
  methods: {
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleCurrentChange(pager) {
      // 获取列表数据，参数为点击的页码
      this.page = pager;
      this.getPageList();
    },
    handleSizeChange(limit) {
      // 当分页器某一页需要显示的数据发生变化的时候会触发
      this.limit = limit;
      this.getPageList();
    },
    handleAvatarSuccess(res, file) {
      // 上传图片相关回调
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    updateTradeMark(row) {
      this.tmForm.id = "";
      this.dialogVisible = true;
      // 显示当前的信息与图片
      this.tmForm.tmName = row.tmName;
      this.tmForm.logoUrl = row.logoUrl;
      // 添加id信息，每次先清空
      this.tmForm.id = row.id;
      // console.log(row);
    },

    deleteTradeMark(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 点击确定触发
        .then(async () => {
          await this.$API.trademark.reqDeleteTradeMark(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 再次获取品牌列表数据，
          this.getPageList();
        })
        // 点击取消触发
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    addOrUpdateTradeMark() {
      // 首先需要验证字段通过，通过ref获取节点
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 提示成功
            this.$message(this.tmForm.id ? "修改成功" : "添加品牌成功");
            this.getPageList();
          }
        }
      });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style lang='less' scoped>
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>