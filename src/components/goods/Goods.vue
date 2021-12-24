<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 搜索框以及按钮 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            @clear="getGoogsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoogsList"
            />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格内容 -->
      <el-table :data="goodsList" stripe border class="mainTable">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="500px" />
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="100px"
          align="center"
        />
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="90px"
          align="center"
        />
        <el-table-column label="创建时间" align="center" width="180px">
          <template slot-scope="scope">
            {{ scope.row.upd_time | timeFilter }}
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 30, 50, , 100, 300]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
    };
  },
  methods: {
    // 获取商品列表数据
    async getGoogsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.params,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品数据失败");
      this.total = res.data.total;
      this.goodsList = res.data.goods;
      console.log(this.goodsList);
    },
    // 分页大小改变时触发
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;
      this.getGoogsList();
    },
    // 分页页数改变时触发
    handleCurrentChange(newNum) {
      this.params.pagenum = newNum;
      this.getGoogsList();
    },
    // 删除商品请求
    deleGoods(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async()=>{
        const {data:res}=await this.$http.delete(`goods/${row.goods_id}`)
        if(res.meta.status!==200)return this.$message.error('删除商品失败')
        this.getGoogsList()
        this.$message.success('删除商品成功')
      }).catch(()=>{
        this.$message.info('已经取消删除商品')
      })
    },
    // 添加商品,路由跳转到添加组件
    addGoods(){
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoogsList();
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.mainTable {
  font-size: 13px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>