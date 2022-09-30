<template>
  <div class="container">
    <div class="left">
      <el-breadcrumb
        separator="/"
        style="display: inline-block; margin-left: 10px"
      >
        <el-breadcrumb-item :to="'/'">前台</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
        <div style="display: inline-block">
          <span>admin</span>
        </div>
    </div>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
      currentPathName: "",
      dialog: false, //控制个人中心显示
      form: {}, //个人信息数据
      formLabelWidth: "70px",
      loading: false,
      pathName:'',
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style scoped>
.container {
  line-height: 60px;
  display: flex;
}
.left {
  height: 100%;
  flex: 1;
}
.right {
  height: 100%;
}
</style>
