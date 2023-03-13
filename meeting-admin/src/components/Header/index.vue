<template>
  <div id="Header">
    <!-- 展示学校logo、管理员头像等 -->
  </div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
  name: 'Header',
  data() {
    return {
      adminInfo: null,
    }
  },
  created() {
    // 获取用户信息
    console.log(JSON.parse(Cookie.get('adminInfo')));
    this.adminInfo = JSON.parse(Cookie.get('adminInfo'));
  }
}
</script>

<style>

</style>