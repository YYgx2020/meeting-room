<template>
  <div id="not-found">
    <div class="bg">
      <img src="@/assets/img/404.png" alt=""/>
    </div>
    <div class="back" @click="backToPrePage()">
      <span>返回登录页</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 返回登录页面
    backToPrePage() {
      this.$router.replace({
        name: 'login',
      })
    }
  }
}
</script>

<style lang="less" scoped>
#not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .bg {
    width: 40vw;
    img {
      width: 100%;
    }
  }
  .back {
    cursor: pointer;
  }

  .back:hover {
    color: #409eff;
  }
}
</style>