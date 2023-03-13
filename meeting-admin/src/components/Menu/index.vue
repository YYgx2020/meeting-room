<template>
  <div id="Menu">
    <!-- 
      功能：
      1.处理预约 handleAppointments
      2.学生/教师认证申请审核 UserManagement
      3.会议室管理 roomManagement
    -->
    <el-menu :router='true' default-active="/home/handleAppointments" class="el-menu-vertical-demo"
      background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <div v-for="(item, index) in menus" :key="index + ''">
        <el-menu-item :index="item.path">
          <i :class="item.iconClass"></i>
          <span slot="title">{{ item.name }}
          </span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      menus: [],
    }
  },
  created() {
    console.log(this.$router.options.routes);
    // 目前菜单较少
    this.menus = [...this.$router.options.routes[1].children];
  },
}
</script>

<style lang="less" scoped>
#Menu {
  height: calc(100vh - 60px);

  .el-menu {
    text-align: left;
    border-right: none;
  }
}
</style>