<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="isActive - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab标签页 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="isActive"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息选项卡 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="casProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(itemB, index) in item.attr_vals"
                  :label="itemB"
                  :key="index"
                  border
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="upLoadAddress"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="upLoadHeader"
              :on-success="successUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="myQuillEditor" v-model="content" />
            <el-button type="primary" @click="confirmAdd" class="btn"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picVisible" width="30%">
      <img :src="previewPic" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash库
import _ from 'lodash'

export default {
  data() {
    return {
      isActive: "0",
      // 添加表单数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片数组
        pics: [],
        goods_introduce: "",
        attrs:[]
      },
      // 添加表单规则
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      // 分类列表数据
      cateList: [],
      // 级联选择器的设置
      casProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
      },
      // 商品参数列表
      manyList: [],
      // 商品属性列表
      onlyList: [],
      // 配置上传图片组件的请求头
      upLoadHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片是否预览
      picVisible: false,
      // 图片预览URL
      previewPic: "",
      // 富文本输入的内容
      content: "",
    };
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 级联选择器改变值时触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
      console.log(this.addForm.goods_cat);
    },
    // 判断选项卡是否可以被点击
    beforeLeave() {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 选项卡点击时触发
    async tabClick() {
      // 商品参数
      if (this.isActive === "1") {
        const params = {
          sel: "many",
        };
        const { data: res } = await this.$http.get(
          `categories/${this.getLastId}/attributes`,
          { params }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取商品参数列表失败");
        this.manyList = res.data;
        this.manyList.forEach((item) => {
          if (item.attr_vals.length === 0) return (item.attr_vals = []);
          item.attr_vals = item.attr_vals.split(" ");
        });
        this.$message.success("获取商品参数列表成功");
        console.log(this.manyList);
      }

      // 商品属性
      if (this.isActive === "2") {
        const params = {
          sel: "only",
        };
        const { data: res } = await this.$http.get(
          `categories/${this.getLastId}/attributes`,
          { params }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取商品属性列表失败");
        this.onlyList = res.data;
        this.$message.success("获取商品属性列表成功");
        console.log(this.onlyList);
      }
    },
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.previewPic = file.response.data.url;
      this.picVisible = true;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      const oldFilePath = file.response.data.tmp_path;
      const oldIndex = this.addForm.pics.findIndex((item) => {
        if (item.pic === oldFilePath) return;
      });
      this.addForm.pics.splice(oldIndex, 1);
    },
    // 文件上传成功后的钩子
    successUpload(response) {
      const params = { pic: response.data.tmp_path };
      this.addForm.pics.push(params);
      console.log(this.addForm);
    },
    // 确认添加商品按钮
    confirmAdd() {
      this.addForm.goods_introduce = this.content;
      this.$refs.addFormRef.validate(async(vali) => {
        if (!vali) return this.$message.error("添加商品失败,请检查添加信息");
        // 校验通过后实现业务逻辑
        const fakeAddForm = _.cloneDeep(this.addForm)
        fakeAddForm.goods_cat = fakeAddForm.goods_cat.join(",");

        this.manyList.forEach(item=>{
          const newParams={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newParams)
        })

        this.onlyList.forEach(item=>{
          const newParams2={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newParams2)
        })
        
        fakeAddForm.attrs=this.addForm.attrs

        const{data:res}=await this.$http.post('goods',fakeAddForm)
        console.log(res);
        if(res.meta.status!==201)return this.$message.error('添加商品失败,请检查参数')
        this.$router.push('/goods')
        this.$message.success('添加商品成功')
      });
    },
  },
  computed: {
    // 获取分类列表最后一个数据
    getLastId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      else return null;
    },
    // 上传的文件地址
    upLoadAddress() {
      return "https://lianghj.top:8888/api/private/v1/upload";
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
.el-steps {
  margin-top: 30px;
}
.el-tabs {
  margin-top: 25px;
}
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
.btn {
  margin-top: 15px;
}
</style>