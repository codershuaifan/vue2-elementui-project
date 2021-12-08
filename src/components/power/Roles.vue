<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!-- 表格内容 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="展开" width="70px" class="expand">
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['borderbottom', 'flex', index === 0 ? 'bordertop' : '']"
            >
              <el-col :span="5">
                <el-tag closable @close="deleTags(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :class="['flex', index2 === 0 ? '' : 'bordertop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleTags(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleTags(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" />
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <!-- 操作列 -->
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="upteRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleRoles(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addVisible" width="50%">
      <!-- 表单区域 -->
      <el-form
        ref="addFormRef"
        :model="addFrom"
        label-width="80px"
        :rules="addRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="upteVisible" width="50%">
      <!-- 表单区域 -->
      <el-form
        ref="upteFormRef"
        :model="oldData"
        label-width="80px"
        :rules="addRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="oldData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="oldData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer">
        <el-button @click="upteVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpteRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出分配权限 -->
    <el-dialog title="分配权限" :visible.sync="giveRightsVisible" width="50%" @close="clear">
      <!-- 树形控件 -->
      <el-tree
        :data="rolesTree"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmAddRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rolesTree: [],
      addVisible: false,
      addFrom: {
        roleName: "",
        roleDesc: "",
      },
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "长度需要大于 3 个字符",
            trigger: "blur",
          },
        ],
      },
      upteVisible: false,
      oldData: {
        roleName: "",
        roleDesc: "",
      },
      currentRolesId: 0,
      giveRightsVisible: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defaultKeys: [],
      currentAddRolesId:0
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    addRoles() {
      this.addVisible = true;
    },
    confirmAddRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("添加失败，请检查提交信息");

        const { data: res } = await this.$http.post("roles", this.addFrom);
        if (res.meta.status !== 201)
          return this.$message.error("添加失败，请检查提交信息");
        this.getRolesList();
        this.$message.success("添加角色成功");
        this.addVisible = false;
      });
    },
    upteRoles(row) {
      this.upteVisible = true;
      this.oldData.roleName = row.roleName;
      this.oldData.roleDesc = row.roleDesc;
      this.currentRolesId = row.id;
    },
    confirmUpteRoles() {
      this.$refs.upteFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("更新角色信息失败");

        const { data: res } = await this.$http.put(
          `roles/${this.currentRolesId}`,
          this.oldData
        );
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("更新角色信息失败");
        this.getRolesList();
        this.$message.success("更新角色信息成功");
        this.upteVisible = false;
      });
    },
    deleRoles(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${row.id}`);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getRolesList();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    deleTags(row, id2) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${row.id}/rights/${id2}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          row.children = res.data;
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async getRolesTree() {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesTree = res.data;
      console.log(this.rolesTree);
    },
    // 递归添加所有节点
    getAllNodes(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getAllNodes(item, arr);
      });
    },
    showRightsVisible(row) {
      this.getAllNodes(row, this.defaultKeys);
      this.giveRightsVisible = true;
      this.currentAddRolesId=row.id
    },
    clear(){
      this.defaultKeys=[]
      this.$router.go(0)
    },
    async comfirmAddRights(){
      const rids=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const params=rids.join(',')
      const{data:res}=await this.$http.post(`roles/${this.currentAddRolesId}/rights`,{rids:params})
      console.log(res);
      if(res.meta.status!==200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.giveRightsVisible=false
    }
  },
  created() {
    this.getRolesList();
    this.getRolesTree();
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bordertop {
  border-top: 1px solid #eee;
}
.borderbottom {
  border-bottom: 1px solid #eee;
}
.flex {
  display: flex;
  align-items: center;
}
</style>