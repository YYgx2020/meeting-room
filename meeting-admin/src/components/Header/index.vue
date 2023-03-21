<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-21 16:45:41
-->
<template>
  <div id="Header">
    <el-col :xs="14" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="left-panel">
        <!-- 展示学校logo、管理员头像等 -->
        <i
          :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          :title="collapse ? '展开' : '收起'"
          class="fold-unfold"
          @click="handleCollapse"
        ></i>

        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-BreadcrumbItem
            v-for="breaditem in breadList"
            :to="{ path: breaditem.path }"
          >
            {{ breaditem.title }}
          </el-BreadcrumbItem>
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
        </el-breadcrumb>
      </div>
    </el-col>
    <el-col :xs="10" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="right-panel">
        <el-dropdown @command="handleCommand">
          <span class="avatar-dropdown">
            <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
            <img
              class="user-avatar"
              src="https://i.gtimg.cn/club/item/face/img/8/15918_100.gif"
              alt=""
            />
            <div class="user-name">
              {{ username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout" divided
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </div>
</template>

<script>
import { BreadcrumbItem } from 'element-ui';
import Cookie from 'js-cookie';
import { mapMutations, mapGetters } from 'vuex';
export default {
  name: 'Header',
  data() {
    return {
      adminInfo: null,
      username: '管理员',
      breadList: [],
    };
  },
  created() {
    // 获取用户信息
    // console.log(JSON.parse(Cookie.get('adminInfo')));
    this.adminInfo = JSON.parse(Cookie.get('adminInfo'));
    this.routeInit();
  },
  watch: {
    $route() {
      this.routeInit();
    },
  },
  methods: {
    ...mapMutations({
      SET_COLLAPSE: 'SET_COLLAPSE',
    }),
    routeInit() {
      this.breadList = [];
      this.$route.matched.forEach((item) => {
        this.breadList.push({
          title: item.meta.title,
          path: item.path,
        });
      });
      console.log(this.breadList);
    },
    handleCollapse() {
      this.SET_COLLAPSE();
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
      }
    },
    logout() {
      this.$baseConfirm(this.username + ',您确定要退出吗?', null, () => {
        this.$router.push('/');
      });
    },
  },
  computed: {
    ...mapGetters({
      collapse: 'get_collapse',
    }),
  },
};
</script>

<style lang="less">
#Header {
  height: 100%;
  width: 100%;
  
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: 50px;
    padding: 0;

    .user-avatar {
      width: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 50%;
      transition: all 1s;

      &:hover {
        transform: scale(1.2);
      }
    }

    .user-name {
      position: relative;
      margin-left: 5px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}

// #Header:hover {
//   transform: scale(1.5);
// }

.fold-unfold {
  float: left;
  width: 30px;
}

.el-header {
  padding: 0;
}

.left-panel {
  height: 60px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
}

.right-panel {
  height: 60px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>
