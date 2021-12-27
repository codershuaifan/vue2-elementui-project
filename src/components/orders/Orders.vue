<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"/>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#" />
        <el-table-column prop="order_number" label="订单编号" width="260px" />
        <el-table-column
          prop="order_price"
          label="订单价格"
          align="center"
          width="100px"
        />
        <!-- 是否付款 -->
        <el-table-column label="是否付款" align="center" width="120px">
          <template slot-scope="scoped">
            <el-tag type="success" v-if="scoped.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <!-- 是否发货 -->
        <el-table-column label="是否发货" align="center" width="120px">
          <template slot-scope="scoped">
            <el-tag
              type="success"
              v-if="scoped.row.is_send === '是'"
              effect="dark"
              >是</el-tag
            >
            <el-tag type="danger" v-else effect="dark">否</el-tag>
          </template>
        </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" align="center" width="230px">
          <template slot-scope="scoped">
            {{ scoped.row.create_time | timeFilter }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="changeVisible = true"
            />
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="small"
              @click="seekPro"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="changeVisible"
      width="50%"
      @close="clearChange"
    >
      <el-form
        :model="changeForm"
        :rules="changeRules"
        ref="changeRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="changeForm.address"
            :options="cityData"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="changeForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="proVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in proData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  data() {
    return {
      search: "",
      // 获取订单列表数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8,
      },
      // 获取订单列表总条数
      total: 0,
      // 订单列表数据
      orderList: [],
      // 修改地址对话框显示
      changeVisible: false,
      // 修改地址表单数据
      changeForm: {
        address: [],
        detail: "",
      },
      // 验证修改地址规则
      changeRules: {
        address: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 导入外部地址信息
      cityData,
      // 物流进度对话框显示
      proVisible: false,
      // 物流数据
      proData: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getOrderList();
    },
    // 清楚修改对话框
    clearChange() {
      this.$refs.changeRef.resetFields();
    },
    confirmChange() {
      this.$refs.changeRef.validate((vali) => {
        if (!vali) return this.$message.error("修改失败，请检查地址信息");
        this.$message.success("修改成功");
        this.changeVisible = false;
      });
    },
    // 点击物流信息按钮触发
    seekPro() {
      this.proVisible = true;
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>