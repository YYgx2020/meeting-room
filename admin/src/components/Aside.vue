<template>
  <el-menu
    style="min-height: 100%"
    background-color="rgb(48, 65, 86)"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <b style="color: white; margin-left: 5px">后台管理系统</b>
    </div>
    <el-menu-item index="home">
      <i class="el-icon-location"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="user">
        <i class="el-icon-location"></i>
        <span slot="title">用户模块</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
