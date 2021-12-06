<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card" shadow="hover">
      <!-- 搜索内容 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            @clear="getusersdata"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getusersdata"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addusers">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="userslist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changestatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="174px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="upteusers(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUsers(scope.row)"
            />
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetform"
    >
      <!-- 对话框内容:表单 -->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="upteVisible"
      width="50%"
      @close="closeUpteForm"
    >
      <!-- 内容表单区域 -->
      <el-form
        ref="upteformref"
        :model="oldusersdata"
        label-width="80px"
        :rules="upterules"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input v-model="oldusersdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="oldusersdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="oldusersdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
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
    // 自定义校验邮箱
    const checkemail = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(value)) return callback(new Error("请输入正确的邮箱"));
      callback();
    };
    //自定义校验手机号
    const checkmobile = (rule, value, callback) => {
      const reg = /^[1][3,4,5,6.7,8,9][0-9]{9}$/;
      if (!reg.test(value)) return callback(new Error("请输入正确的手机号"));
      callback();
    };
    return {
      params: {
        query: "",
        pagenum: 1,
        pagesize: 8,
      },
      userslist: [],
      total: 0,
      currentPage: 1,
      dialogVisible: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      upteVisible: false,
      oldusersdata: {},
      upterules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getusersdata() {
      const { data: res } = await this.$http.get("users", {
        params: this.params,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userslist = res.data.users;
      // console.log(res);
      // console.log(this.userslist);
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getusersdata();
    },
    handleCurrentChange(val) {
      this.params.pagenum = val;
      this.getusersdata();
    },
    async changestatus(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("修改用户状态失败");
      this.$message.success("修改用户状态成功");
    },
    addusers() {
      this.dialogVisible = true;
    },
    resetform() {
      this.$refs.form.resetFields();
    },
    confirmAdd() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return this.$message.error("添加用户失败,请检查信息");
        const { data: res } = await this.$http.post("users", this.form);
        console.log(res);
        this.getusersdata();
        this.dialogVisible = false;
        this.$message.success("添加用户成功");
      });
    },
    async upteusers(row) {
      const { data: res } = await this.$http.get(`users/${row.id}`);
      this.oldusersdata = res.data;
      // console.log(this.oldusersdata);
      this.upteVisible = true;
    },
    closeUpteForm() {
      this.$refs.upteformref.resetFields();
    },
    confirmUpte() {
      this.$refs.upteformref.validate(async (valid) => {
        if (!valid) return this.$message.error("修改失败，请检查信息");
        const { data: res } = await this.$http.put(
          `users/${this.oldusersdata.id}`,
          this.oldusersdata
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改失败，请检查信息");
        this.$message.success("更新信息成功");
        this.getusersdata();
        this.upteVisible = false;
      });
    },
    deleteUsers(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async ()=>{
        const {data:res}=await this.$http.delete(`users/${row.id}`)
        if(res.meta.status===200){
          this.getusersdata()
          this.$message.success('删除成功')
        }
        else return this.$message.error('删除失败')
      }).catch(()=>{
        this.$message.info('已取消删除')
      })
    },
  },
  created() {
    this.getusersdata();
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 15px;
}
</style>