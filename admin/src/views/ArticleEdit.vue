<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <!-- form标签有默认行为，当子组件中含有单个input组件时，输入回车后会自动提交表单，使用
    @submit.native.prevent="save"可以阻止此行为 -->
    <el-form label-width="100px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <!-- 原本的image提交表单，会以base64的格式向后端请求，造成请求过大的问题，所以图片上传要做成upload的形式存储 -->
        <vue-editor
          useCustomImageHandler
          @image-added="handleImageAdded"
          v-model="model.body"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  props: {
    id: {},
  },
  components: {
    VueEditor,
  },
  data() {
    return {
      model: {},
      categories: [],
    };
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData(); //需要在表单中进行文件上传时，就需要使用该格式
      formData.append("file", file);

      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/articles", this.model);
      }
      this.$router.push("/articles/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },
    async fetchCatgories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
  },
  created() {
    this.fetchCatgories();
    this.id && this.fetch();
  },
};
</script>