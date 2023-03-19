<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-19 11:32:07
-->
<template>
  <div id="Header">
    <!-- 展示学校logo、管理员头像等 -->
    <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" :title="collapse ? '展开' : '收起'" class="fold-unfold"
      @click="handleCollapse"></i>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapMutations, mapGetters } from 'vuex'
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
  },
  methods: {
    ...mapMutations({
      SET_COLLAPSE:'SET_COLLAPSE'
    }),
    handleCollapse() {
        this.SET_COLLAPSE()
      },
  },
  computed: {
    ...mapGetters({
      collapse:'get_collapse'

    })
  }

}
</script>

<style lang="less">
#Header{
  display: flex;
  float: left;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  transition: all 1s;

}
#Header:hover{
  transform: scale(1.5);
}
.fold-unfold{
  float: left;
  width: 30px;
  margin: 0 auto;
  
}
.el-header{
  padding: 0;
}
</style>