<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-16 08:46:42
 * @LastEditTime: 2023-03-16 13:28:07
-->
<template>
  <div class="container">
    <el-table :data="tableData" style="width: 100%" align='center' max-height="400px">
      <el-table-column label="序号" align='center' width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="appointName" label="申请人" align='center' width="80">
        <!-- <span v-if="listData.isProve==0">111</span> -->
        <!-- <template slot-scope="scope"> -->
        <!-- {{scope.row}} -->


        <!-- </template> -->
      </el-table-column>
      <el-table-column prop="appointPhone" label="联系方式" align='center' width="100" sortable>
      </el-table-column>
      <el-table-column prop="roomid" label="预约教室" align='center' width="100" sortable>

      </el-table-column>
      <el-table-column label="预约时间" align='center' width="150" sortable>
        <template slot-scope="scope">
          {{ scope.row.time.startTime }}-{{ scope.row.time.endTime }}
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align='center' width="0">

      </el-table-column>
      <el-table-column prop="thingsText" label="申请事宜" align='center' width="150">
      </el-table-column>
      <el-table-column prop="op" label="操作" align='center' width="150">
        <el-button size="mini" @click="addroom" type="success">同意</el-button>
        <el-button size="mini" @click="addroom" type="danger">不同意</el-button>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MeetingAdminListItem',
  props: {
    listData: Array,
  },

  data() {
    return {
      tableData: [],
    };
  },

  mounted() {
    console.warn('jjjjjjjjjjjjjjjjjjjjjjjjjj');
    console.log(this.listData);
    this.initData()

  },
  watch: {
    listData(newV) {
      this.initData()
    },
    state(newV) {
      this.initData()
    }
  },
  methods: {
    addroom() { },
    initData() {
      this.tableData = [...this.listData]
      console.log(this.tableData);
    }
  },

};
</script>

<style lang="less" scoped>
.container {
  // background-color: aqua;
  line-height: 25px;
  height: 100%;

  // .el-tabs--border-card >.el-tabs__content{
  //     padding: 0px;
  //   }
  /deep/.el-table {
    text-align: left;

    .el-button {
      width: 50px;

      // text-align: center;
      span {
        // text-align: center;
      }

    }

    .el-button--mini {
      padding: 7px 0px;
    }
  }



}</style>