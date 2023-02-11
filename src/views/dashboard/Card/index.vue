<template>
  <div>
    <!-- gutter 属性来设置方格之间的距离 -->
    <el-row :gutter="10">
      <!-- 第一个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126566">
            <template slot="charts"
              ><span>周同比 56.69% <i class="el-icon-caret-top"></i> </span
              ><span>同日比 19.96% <i class="el-icon-caret-bottom"></i></span
            ></template>
            <template slot="footer"><span>日销售额 ￥ 12345</span></template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="12345">
            <template slot="charts">
              <lineCharts />
            </template>
            <template slot="footer">
              <span>日访问量: 5555</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="54321">
            <template slot="charts">
              <barCharts />
            </template>
            <template slot="footer">
              <span>转换率66%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressCharts />
            </template>
            <template slot="footer">
              <span>周同比 56.69%<i class="el-icon-caret-top"></i></span>
              <span>同日比 19.96%<i class="el-icon-caret-bottom"></i></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineCharts from "./lineChart";
import barCharts from "./barCharts";
import progressCharts from "./progressCharts";
export default {
  name: "Card",
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts,
  },
};
</script>

<style scoped>
.el-icon-caret-top {
  color: green;
  margin-right: 10px;
}
.el-icon-caret-bottom {
  color: red;
}
</style>
