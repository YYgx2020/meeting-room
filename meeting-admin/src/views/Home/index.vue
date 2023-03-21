<template>
  <div id="Home">
    <el-container>
      <el-aside :width="collapse ? '' : '200px'" class="aside">
        <div class="logo">
          <h4>{{ collapse ? 'GUET' : 'GUET会议室预约管理系统' }}</h4>
          <!-- GUET会议室预约管理系统 -->
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
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Header,
    Menu,
    Footer,
  },
  data() {
    return {
      title: 'GUET',
      width: '200px',
    };
  },
  created() {
    // 获取用户信息
    // console.log(JSON.parse(Cookie.get('adminInfo')));
    const adminInfo = JSON.parse(Cookie.get('adminInfo'));
  },
  computed: {
    ...mapGetters({
      collapse: 'get_collapse',
    }),
  },
  watch: {},
};
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
    // transition: all 0.5s;

    // .logo:hover{
    //   // width: 400px;
    //   // display: none;
    //   // transform: ;
    //   width: 0px;
    //   transform: scale(1.6);
    // }
    .logo {
      line-height: 60px;
      color: #409eff;
      h4 {
        font-weight: 500;
      }
      transition: all 3s;

      cursor: pointer;
    }
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding: 20px 20px 0px;
  }

  body > .el-container {
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
