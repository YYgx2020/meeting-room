<template>
  <div id="Home">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h4>GUET会议室预约管理系统</h4>
        </div>
        <Menu></Menu>
      </el-aside>

      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

import Cookie from 'js-cookie';

export default {
  name: 'Home',
  components: {
    Header,
    Menu,
    Footer,
  },
  data() {
    return {

    }
  },
  created() {
    // 获取用户信息
    console.log(JSON.parse(Cookie.get('adminInfo')));
    const adminInfo = JSON.parse(Cookie.get('adminInfo'));
  }
}
</script>

<style lang="less" scoped>
#Home {

  .el-header,
  .el-footer {
    // background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #304156;
    color: #fff;
    text-align: center;
    // line-height: 200px;
    height: 100vh;

    .logo {
      line-height: 60px;
      color: #409EFF;
      h4 {
        font-weight: 500;
      }
      cursor: pointer;
    }
    // .logo:hover {
    //   background-color: #303133;
    // }
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}
</style>