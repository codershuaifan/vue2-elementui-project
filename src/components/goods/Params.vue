<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      />
      <!-- 级联选择器 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="stepsValue"
            :options="cateList"
            :props="stepsProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isShow"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyList" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleValue(scope.row, index)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column label="参数名称" prop="attr_name" />
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="upteParmas(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isShow"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyList" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleValue(scope.row, index)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column label="属性名称" prop="attr_name" />
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="upteParmas(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹出添加对话框(供两个按钮使用) -->
    <el-dialog
      :title="'添加' + chooseName"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearForm"
    >
      <!-- 内容区域 -->
      <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item :label="chooseName" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出修改对话框(供两个按钮使用) -->
    <el-dialog
      :title="'修改' + chooseName"
      :visible.sync="upteVisible"
      width="50%"
      @close="clearUpteForm"
    >
      <!-- 内容区域 -->
      <el-form
        ref="formUpteRef"
        :model="upteForm"
        label-width="80px"
        :rules="upteRules"
      >
        <el-form-item :label="chooseName" prop="attr_name">
          <el-input v-model="upteForm.attr_name"></el-input>
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
    return {
      cateList: [],
      // 选中的级联选择器商品分类id数组
      stepsValue: [],
      stepsProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      activeName: "many",
      currentId: 0,
      manyList: [],
      onlyList: [],
      dialogVisible: false,
      upteVisible: false,
      // 添加表单的参数
      form: {
        attr_name: "",
      },
      rules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      // 修改表单的参数
      upteForm: {
        attr_name: "",
      },
      upteRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      // 修改表单参数的当前参数id
      currentParamsId: 0,
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据列表失败");
      this.cateList = res.data;
    },
    handleChange() {
      if (this.stepsValue.length !== 3) {
        this.stepsValue = [];
        this.currentId = 0;
        this.manyList = [];
        this.onlyList = [];
        return;
      }
      this.currentId = this.stepsValue[2];
      this.getParamsList();
    },
    handleClick() {
      this.getParamsList();
    },
    // 获取参数列表
    async getParamsList() {
      const params = { sel: this.activeName };
      const { data: res } = await this.$http.get(
        `categories/${this.currentId}/attributes`,
        { params }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      res.data.forEach((item) => {
        item.inputVisible = false;
        item.inputValue = "";
        if (item.attr_vals.length === 0) return;
        item.attr_vals = item.attr_vals.split(" ");
      });
      // 按需存储数据
      if (this.activeName === "many") this.manyList = res.data;
      else this.onlyList = res.data;
    },
    clearForm() {
      this.$refs.formRef.resetFields();
    },
    // 添加参数或属性
    confirmAdd() {
      this.$refs.formRef.validate(async (vali) => {
        if (!vali) return this.$message.error("添加失败");
        const params = {
          attr_name: this.form.attr_name,
          attr_sel: this.activeName,
        };
        const { data: res } = await this.$http.post(
          `categories/${this.currentId}/attributes`,
          params
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.getParamsList();
        this.dialogVisible = false;
      });
    },
    confirmUpte() {
      this.$refs.formUpteRef.validate(async (vali) => {
        if (!vali) return this.$message.error("修改失败");
        const params = {
          attr_name: this.upteForm.attr_name,
          attr_sel: this.activeName,
        };
        const { data: res } = await this.$http.put(
          `categories/${this.currentId}/attributes/${this.currentParamsId}`,
          params
        );
        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.$message.success("修改成功");
        this.getParamsList();
        this.upteVisible = false;
      });
    },
    clearUpteForm() {
      this.$refs.formUpteRef.resetFields();
    },
    upteParmas(row) {
      this.upteForm.attr_name = row.attr_name;
      this.upteVisible = true;
      this.currentParamsId = row.attr_id;
    },
    deleParams(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.currentId}/attributes/${row.attr_id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除成功");
          this.$message.success("删除成功");
          this.getParamsList();
        })
        .catch(() => {
          this.$message.info("已经取消删除");
        });
    },
    // 按下enter或者失去焦点都会触发此方法，从文本切换到按钮
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果输入框是有效内容，则要进行添加处理
      if (row.attr_vals.length === 0) row.attr_vals = [];
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveValue(row);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveValue(row) {
      const params = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      };
      const { data: res } = await this.$http.put(
        `categories/${this.currentId}/attributes/${row.attr_id}`,
        params
      );
      if (res.meta.status !== 200) return this.$message.error("更新失败");
      this.$message.success("更新成功");
    },
    deleValue(row, index) {
      row.attr_vals.splice(index, 1);
      this.saveValue(row);
    },
  },
  computed: {
    isShow() {
      if (this.stepsValue.length === 3) return false;
      return true;
    },
    chooseName() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-row {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 110px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
}
</style>