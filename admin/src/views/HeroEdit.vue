<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <el-form label-width="100px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <!-- $http.defaults.baseURL是一个变量，表示当前的地址 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


<script>
export default {
  props: {
    id: {},
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
    async save() {
      if (this.id) {
        await this.$http.put(`rest/items/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/items", this.model);
      }
      this.$router.push("/items/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/item/${this.id}`);
      this.model = res.data;
    },
    afterUpload(res) {
      this.$set(this.model, 'icon', res.url)
      // 一开始在data里并不存在icon,所以vue可能存在赋值赋不上的情况，可以使用this.$set强制显示声明
      this.model.icon = res.url
      console.log(res);
    },
  },
  created() {
    this.id && this.fetch();
  },
};
</script>