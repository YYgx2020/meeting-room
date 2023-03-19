<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-16 08:46:42
 * @LastEditTime: 2023-03-19 11:51:54
-->
<template>
  <div class="container">
    <el-table v-loading="loading" element-loading-text="加载中，请稍后..." :data="tableData" style="width: 100%" align='center'
      max-height="400px" :height="height">
      <el-table-column label="序号" align='center' width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="appointName" label="申请人" align='center' width="80">
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
    <div class="pagin">
          <el-pagination :background="true" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize"
      :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MeetingAdminListItem',
  props: {
    listData: Array,
    serchValue:String
  },

  data() {
    return {
      tableData: [],
      loading: true,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
      },
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
    };
  },

  mounted() {
    console.log(this.listData);
    this.initData()

  },
  watch: {
    listData(newV) {
      this.initData()
    },
    state(newV) {
      this.initData()
    },
    serchValue(newV) {
      console.log('213  '+newV);
      console.log(this.tableData);
      if (newV === '') {
        this.tableData = [...this.listData]
      }
      else {
        this.tableData = []
        this.listData.forEach(item => {
          if ((item.appointName + '').indexOf(newV) !== -1 || (item.appointPhone + '').indexOf(newV) !== -1) {
              this.tableData.push(item)
              console.log('add');
            }
        })
        console.log(this.tableData);
      }
    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  methods: {
    addroom() { },
    initData() {
      this.loading = true
      this.tableData = [...this.listData]
      this.total=this.tableData.length
      console.log(this.tableData);
      setTimeout(() => {
        this.loading = false
      }, 500);
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
    },
  },

};
</script>

<style lang="less" scoped>
.container {
  // background-color: aqua;
  line-height: 25px;
  height: 100%;

  /deep/.el-table {
    text-align: left;

    .el-button {
      width: 50px;

      span {}
    }

    .el-button--mini {
      padding: 7px 0px;
    }
  }
  .pagin{
    // background-color: red;
    min-width: 200px;
    overflow: auto;
  }


}
</style>