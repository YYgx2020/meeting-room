<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-21 11:55:57
-->
<template>
  <div class="handle-appoinement">
    <el-tabs type="border-card" v-model="activeName" stretch>
      <el-tab-pane label="待审核" name="0"></el-tab-pane>
      <el-tab-pane label="已通过" name="1"></el-tab-pane>
      <el-tab-pane label="未通过" name="-1"></el-tab-pane>

      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="serch"
            placeholder="输入学号或姓名或电话号码"
            size="mini"
          />
        </el-form-item>

        <el-form-item label-width="50px">
          <el-button
            icon="el-icon-search"
            type="primary"
            size="mini"
            @click="handleQuery"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <div style="minheight: 100%">
        <listItem
          :listData="list"
          :state1="TabActiveName"
          :serchValue="serchValue"
          @op_event="op_event"
        ></listItem>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import listItem from './componet/listItem';
import { getTcount, getScount } from '@/api';

export default {
  name: 'Home',
  components: {
    listItem,
  },

  data() {
    return {
      list: [],
      state: 1,
      activeName: '',
      serch: '',
      serchValue: '',
    };
  },
  created() {
    // 获取审核列表
    // console.log('获取审核列表');
    this.getCount();
  },
  methods: {
    op_event(){
      this.getCount()
    },
    async getCount() {
      this.list=[]
      let c1 = (await getScount()).data.data;
      let c2 = (await getTcount()).data.data;
      // console.log(c1, c2);
      let t = c1.concat(c2);
      t.forEach((item) => {
        this.list.push(JSON.parse(item));
      });
      console.error("list");
       console.log(this.list);
    },
    handleQuery() {
      this.serchValue = this.serch;
    },
  },
  computed: {
    TabActiveName() {
      return Number.parseInt(this.activeName);
    },
  },
};
</script>

<style lang="less" scoped>
.handle-appoinement {
  line-height: 20px;
}

/deep/ .el-tabs__nav-scroll {
  height: 50px;
  line-height: 60px;
}
/deep/.el-tabs--border-card {
  .el-tabs__nav.is-stretch {
    height: 102%;
    .el-tabs__item {
      height: 100%;
    }
  }
}
/deep/ .el-form {
  float: right;
  height: 40px;
}
/deep/.el-tabs__content {
  // background-color: aqua;
  padding: 0;
}
</style>
