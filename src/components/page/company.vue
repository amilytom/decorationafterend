<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-calendar"></i> {{ title }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="企业名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="form.latitude"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <quill-editor
              ref="myTextEditor"
              v-model="form.intro"
              :options="editorOption"
            ></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  data: function () {
    return {
      title: this.$route.meta.title,
      editorOption: {
        placeholder: "Hello World",
      },
      form: {
        title: "",
        subtitle: "",
        about: "",
      },
    };
  },
  components: {
    quillEditor,
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData(search) {
      this.fetchData({
        method: "get",
        url: "/api/company",
        success: (data) => {
          this.form = data;
        },
      });
    },
    onSubmit() {
      let vm = this;
      vm.fetchData({
        method: "put",
        url: "/api/company",
        data: vm.form,
        success: (data) => {
          vm.$message.success("提交成功！");
          vm.getData();
        },
      });
    },
  },
};
</script>
