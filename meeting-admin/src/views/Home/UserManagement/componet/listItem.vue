<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-16 08:46:42
 * @LastEditTime: 2023-03-21 10:31:21
-->
<template>
  <div class="container">
    <el-table
      v-loading="loading"
      element-loading-text="加载中，请稍后..."
      :data="tableDate"
      style="width: 100%"
      align="center"

      :height="height"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center" width="80">
        <!-- <span v-if="listData.isProve==0">111</span> -->
        <!-- <template slot-scope="scope"> -->
        <!-- {{scope.row}} -->
        <span v-if="state == 0">待审核</span>
        <span v-else-if="state == 1">已通过</span>
        <span v-else="state == -1">待审核</span>

        <!-- </template> -->
      </el-table-column>
      <el-table-column
        prop="Tname"
        label="身份"
        align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <span v-if="scope.row.role == 1">教师</span>
          <span v-else>学生</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Tname"
        label="姓名"
        align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <span v-if="scope.row.role == 1">{{ scope.row.teacherName }}</span>
          <span v-else>{{ scope.row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tel"
        label="学号"
        align="center"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <span v-if="scope.row.role == 1">{{ scope.row.teacherPhone }}</span>
          <span v-else>{{ scope.row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" width="0">
        <template slot-scope="scope">
          <span v-if="scope.row.role == 1">{{ scope.row.teacherEmail }}</span>
          <span v-else>{{ scope.row.studentEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lab" label="所属实验室" align="center" width="150">
      </el-table-column>
      <el-table-column prop="op" label="操作" align="center" width="150">
        <template v-if="state == 0" slot-scope="{ row }">
          <el-button size="mini" @click="handleAgree(row)" type="success"
            >同意</el-button
          >
          <el-button size="mini" @click="handleDisagree(row)" type="danger"
            >不同意</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagin">
      <el-pagination
        :background="true"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { updateUserInfo } from '@/api';

export default {
  name: 'MeetingAdminListItem',
  props: {
    listData: Array,
    state1: Number,
    serchValue: String,
  },

  data() {
    return {
      tableDate: [],
      loading: true,
      state: 0,
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
    this.loading = true;
    // this.initData()
    // this.state=0
  },
  watch: {
    listData: {
      handler(newV) {
        console.error('listData');

        this.initData();
      },
      immediate: false,
    },
    // listData(newV) {
    //   console.error('listData');

    // },
    state1(newV) {
      // console.error('state2');
      // console.log(this.state2);
      this.state = newV;
      this.initData();
    },
    serchValue(newV) {
      // console.log(2222);
      // console.log(this.tableDate);
      if (newV === '') {
        this.tableDate = [...this.listData];
      } else {
        this.tableDate = [];
        this.listData.forEach((item) => {
          if (item.role === 0) {
            if (
              (item.studentName + '').indexOf(newV) !== -1 ||
              (item.studentNumber + '').indexOf(newV) !== -1 ||
              (item.studentPhone + '').indexOf(newV) !== -1
            ) {
              this.tableDate.push(item);
              // console.log('add');
            }
          } else {
            if (
              (item.teacherName + '').indexOf(newV) !== -1 ||
              (item.teacherPhone + '').indexOf(newV) !== -1 ||
              (item.teacherPhone + '').indexOf(newV) !== -1
            ) {
              this.tableDate.push(item);
              // console.log('add');
            }
          }
        });
      }
    },
  },
  computed: {
    height() {
      return this.$baseTableHeight();
    },
  },
  methods: {
    initData() {
      this.loading = true;
      this.tableDate = [];
      this.listData.forEach((item) => {
        if (item.isProve === this.state) {
          this.tableDate.push(item);
        }
      });
      this.total = this.tableDate.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    addroom() {},
    handleDisagree(item) {
      // console.log(item);
      //学生
      if (item.role == 0) {
        updateUserInfo({
          openid: item.openid,
          sheetName: 'studentInfo',
          isProve: -1,
        }).then((res) => {
          this.initData();
        });
      }
      //老师
      else {
        updateUserInfo({
          openid: item.openid,
          sheetName: 'teacherInfo',
          isProve: -1,
        }).then((res) => {
          this.initData();
        });
      }
    },
    handleAgree(item) {
      if (item.role == 0) {
        updateUserInfo({
          openid: item.openid,
          sheetName: 'studentInfo',
          isProve: 1,
        }).then((res) => {
          this.initData();
        });
      }
      //老师
      else {
        updateUserInfo({
          openid: item.openid,
          sheetName: 'teacherInfo',
          isProve: 1,
        }).then((res) => {
          this.initData();
        });
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
    },
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
    min-width: 650px;

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

  .pagin {
    // background-color: red;
    min-width: 200px;
    overflow: auto;
  }
}
</style>
