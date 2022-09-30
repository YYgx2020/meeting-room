<template>
  <el-container style="min-height: 100vh">
    <el-aside :width="sideWidth + 'px'" style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside></Aside>
    </el-aside>
    <el-container>
      <el-header style="
          font-size: 12px;
          border-bottom: 1px solid #ccc;
          line-height: 70px;
        ">
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '../components/Aside.vue';
import Header from '../components/Header.vue';
export default {
    data() {
        return {
            sideWidth: 200,
        };
    },
    mounted() {
    },
    components: { Aside, Header }
};
</script>

<style scoped></style>
