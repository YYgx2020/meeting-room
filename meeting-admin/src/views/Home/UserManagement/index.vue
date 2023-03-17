<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-17 11:19:17
-->
<template>
  <div class="handle-appoinement">

    <el-tabs type="border-card" >
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs(0)">待审核</span>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs(1)">已通过</span>
                    <!-- <china-tabs-table :toggleData="toggleData"></china-tabs-table> -->
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label" @click="toggleTabs(-1)">未通过</span>
                    <!-- <china-tabs-table :toggleData="toggleData"></china-tabs-table> -->
                </el-tab-pane>
                <div style="minHeight:100%">
                  <listItem :listData="list" :state1="state"></listItem>
</div>
            </el-tabs>

  </div>
</template>

<script>
import listItem from './componet/listItem'
import { getTcount,getScount } from '@/api';
export default {
  name: 'Home',
  components: {
   listItem
  },

  data() {
    return {
      list: [],
      state:1
    }
  },
  created() {
    // 获取审核列表 
    console.log('获取审核列表');
    this.getCount()
  },
  methods: {
    toggleTabs(index) {
      this.state=index
      console.log(index);
    },
    async getCount() {
      let count
      // let c = Promise.all([getTcount, getScount])
      //   .then(res => {
      // console.log('123123123gfgg');
      // console.log(res);
      // })

      let c1 = (await getScount()).data.data
      let c2 = (await getTcount()).data.data
      console.log(c1,c2);
      let t=c1.concat(c2)
      // console.log('sadfasdf13');
      // console.log(t);
      // // let list=[]
      t.forEach(item => {
        this.list.push(JSON.parse(item))
      })
      console.log(this.list);
    }
  },
  computed: {
    
  }
}
</script>

<style lang="less" scoped >

 /deep/ .el-tabs__nav-scroll{
  height: 50px;
  line-height: 60px;
}
/deep/.el-tabs__content{
  // background-color: aqua;
  padding: 0;

}

</style>