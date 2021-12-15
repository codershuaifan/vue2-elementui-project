<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card shadow="hover">
      <el-button type="primary" @click="addType">添加分类</el-button>
      <!-- 表格内容：用的是第三方库TreeTable -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        stripe
        border
        style="margin-top: 15px"
      >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i
            class="el-icon-error"
            style="color: red"
            v-if="scope.row.cat_deleted === true"
          ></i>
        </template>
        <!-- 排序列 -->
        <template slot="index" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="upteCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="dele(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible"
      width="50%"
      @closed="clearAddForm"
    >
      <!-- 内容区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="parentList"
            :props="props"
            @change="handleChange"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="upteVisible" width="50%">
      <!-- 内容区域 -->
      <el-form
        ref="upteForm"
        :model="upteForm"
        label-width="80px"
        :rules="addRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="upteForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="upteVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpte">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      cateList: [],
      total: 0,
      // 设置列数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "index",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addVisible: false,
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentList: [],
      value: [],
      // 设置级联选择器的内容
      props: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true,
      },
      upteVisible: false,
      upteForm: {
        cat_name: "",
      },
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      currentUpteId: 0,
    };
  },
  methods: {
    async geiCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.query,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      // console.log(this.cateList);
    },
    handleSizeChange(val) {
      this.query.pagesize = val;
      this.geiCateList();
    },
    handleCurrentChange(val) {
      this.query.pagenum = val;
      this.geiCateList();
    },
    addType() {
      this.getParentList();
      this.addVisible = true;
    },
    async getParentList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      this.parentList = res.data;
      console.log(this.parentList);
    },
    handleChange() {
      if (this.value.length > 0) {
        this.addForm.cat_level = this.value.length;
        this.addForm.cat_pid = this.value[this.value.length - 1];
      } else {
        this.addForm.cat_level = 0;
        this.addForm.cat_pid = 0;
      }
    },
    async addCate() {
      console.log(this.addForm);
      const { data: res } = await this.$http.post("categories", this.addForm);
      if (res.meta.status !== 201) return this.$message.error("添加分类失败");
      this.$message.success("添加分类成功");
      this.geiCateList();
      this.addVisible = false;
    },
    clearAddForm() {
      this.$refs.addFormRef.resetFields();
      this.value = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
    },
    upteCate(row) {
      this.upteForm.cat_name = row.cat_name;
      this.currentUpteId = row.cat_id;
      this.upteVisible = true;
    },
    async confirmUpte() {
      const { data: res } = await this.$http.put(
        `categories/${this.currentUpteId}`,
        { cat_name: this.upteForm.cat_name }
      );
      if (res.meta.status !== 200) return this.$message.error("更新失败");
      this.geiCateList();
      this.$message.success("更新成功");
      this.upteVisible = false;
    },
    dele(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async()=>{
        const {data:res}=await this.$http.delete(`categories/${row.cat_id}`)
        if(res.meta.status!==200)return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.geiCateList()
      }).catch(()=>{
        this.$message.info('已取消删除')
      })
    },
  },
  created() {
    this.geiCateList();
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
</style>