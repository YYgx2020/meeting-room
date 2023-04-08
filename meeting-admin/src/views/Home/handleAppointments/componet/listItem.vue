<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-16 08:46:42
 * @LastEditTime: 2023-03-20 18:43:41
-->
<template>
  <div class="container">
    <el-table
      v-loading="loading"
      element-loading-text="加载中，请稍后..."
      :data="tableData"
      style="width: 100%"
      align="center"
      :height="height"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="appointName"
        label="申请人"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="appointPhone"
        label="联系方式"
        align="center"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="roomid"
        label="预约教室"
        align="center"
        width="100"
        sortable
      >
      </el-table-column>
      <el-table-column label="预约时间" align="center" width="150" sortable>
        <template slot-scope="scope">
          {{ scope.row.time.startTime }}-{{ scope.row.time.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        align="center"
        width="0"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="thingsText"
        label="申请事宜"
        align="center"
        width="0"
      >
      </el-table-column>
      <el-table-column prop="op" label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAgree(scope.row)" type="success"
            >同意</el-button
          >
          <el-button
            size="mini"
            @click="handleDisagree(scope.row)"
            type="danger"
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
import {
  getRoomInfoByTimeID,
  updateRoomAppointInfo2,
  updateUserAppointInfo2,
} from "@/api";

export default {
  name: "MeetingAdminListItem",
  props: {
    listData: Array,
    serchValue: String,
  },

  data() {
    return {
      tableData: [],
      loading: true,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
    };
  },

  mounted() {
    // console.log(this.listData);
    this.loading = true;

    // console.warn("mouted");
    // this.initData()
  },
  watch: {
    listData(newV) {
      console.warn("listData");

      this.initData();
    },
    state(newV) {
      console.warn("state");

      this.initData();
    },
    serchValue(newV) {
      // console.log('213  ' + newV);
      // console.log(this.tableData);
      if (newV === "") {
        this.tableData = [...this.listData];
      } else {
        this.tableData = [];
        this.listData.forEach((item) => {
          if (
            (item.appointName + "").indexOf(newV) !== -1 ||
            (item.appointPhone + "").indexOf(newV) !== -1
          ) {
            this.tableData.push(item);
            // console.log('add');
          }
        });
        // console.log(this.tableData);
      }
    },
  },
  computed: {
    height() {
      return this.$baseTableHeight();
    },
  },
  methods: {
    addroom() {},
    async handleDisagree(item) {
      console.log("sadasdasd");
      // if (item.isban) return;
      console.log("发请求去获取会议室信息", item.roomid, item.date);
      let res = await getRoomInfoByTimeID({
        roomid: item.roomid,
        time: item.date,
      });
      console.log("res", res);
      const otherAppointInfo = [];
      otherAppointInfo.push(JSON.parse(JSON.stringify(item)));
      console.log("otherAppointInfo 1", otherAppointInfo);
      otherAppointInfo[0].choosed = false;
      const appointArr = res.result.data[0].appointArr;
      item.isban = true;
      appointArr[item.firstIndex].detail[item.secondIndex] = JSON.parse(
        JSON.stringify(item)
      );
      console.log("otherAppointInfo 2", otherAppointInfo);
      console.log("appointArr", appointArr);
      this.updateAppointInfo(
        appointArr,
        otherAppointInfo,
        "其他预约申请的优先级更高",
        item.roomid
      );

      // wx.cloud.database().collection('roomAppointInfo')
      // .where({
      //   roomid: item.roomid,
      //   date: dateList[current].time
      // })
      // .get()
      // .then(res => {
      //   console.log("getres",res);
      //   const otherAppointInfo = [];
      //   otherAppointInfo.push(JSON.parse(JSON.stringify(item)));
      //   otherAppointInfo[0].choosed = false;
      //   const appointArr = res.data[0].appointArr;
      //   item.isban = true;
      //   appointArr[item.firstIndex].detail[item.secondIndex] = JSON.parse(JSON.stringify(item));
      //   this.updateAppointInfo(appointArr, otherAppointInfo, '', item.roomid);
      // })
      // .catch(err => {
      //   console.log(err);
      //   wx.showToast({
      //     title: '出错了',
      //     icon: 'error',
      //   })
      // })
      // console.log(item);
    },
    async handleAgree(item) {
      console.log("sadasdasd");
      // if (item.isban) return;
      console.log("发请求去获取会议室信息", item.roomid, item.date);
      let res = await getRoomInfoByTimeID({
        roomid: item.roomid,
        time: item.date,
      });
      const appointArr = res.result.data[0].appointArr;
      let detail = appointArr[item.firstIndex].detail;
      let otherAppointInfo = JSON.parse(JSON.stringify(detail));
      console.log(otherAppointInfo);
      otherAppointInfo = otherAppointInfo.map((itm, idx) => {
        if (item.secondIndex === idx) {
          itm.choosed = true;
        } else {
          itm.choosed = false;
        }
        return itm;
      });
      // detail = JSON.parse(JSON.stringify(detail[index]));
      // appointArr[item.firstIndex].detail = detail;
      appointArr[item.firstIndex].status = "已预约";
      console.log("agree",appointArr, otherAppointInfo, "", item.roomid,appointArr[item.firstIndex].detail);

      // 更新用户预约信息和会议室预约信息
      this.updateAppointInfo(appointArr, otherAppointInfo, "", item.roomid);

      // wx.cloud.database().collection('roomAppointInfo')
      // .where({
      //   roomid: item.roomid,
      //   date: dateList[current].time
      // })
      // .get()
      // .then(res => {
      //   console.log("getres",res);
      //   const otherAppointInfo = [];
      //   otherAppointInfo.push(JSON.parse(JSON.stringify(item)));
      //   otherAppointInfo[0].choosed = false;
      //   const appointArr = res.data[0].appointArr;
      //   item.isban = true;
      //   appointArr[item.firstIndex].detail[item.secondIndex] = JSON.parse(JSON.stringify(item));
      //   this.updateAppointInfo(appointArr, otherAppointInfo, '', item.roomid);
      // })
      // .catch(err => {
      //   console.log(err);
      //   wx.showToast({
      //     title: '出错了',
      //     icon: 'error',
      //   })
      // })
      // console.log(item);
    },
    async updateAppointInfo(
      appointArr,
      otherAppointInfo,
      rejectReason,
      roomid
    ) {
      console.log("data", appointArr, otherAppointInfo, rejectReason, roomid);
      // 创建 promise 数组
      const p_arr = [];
      // console.log("appointArr: ", appointArr);
      // console.log("updata1",roomid,otherAppointInfo[0].date);
      let p1 = null;
      try {
        p1 = await updateRoomAppointInfo2({
          roomid,
          time: otherAppointInfo[0].date,
          appointArr,
        });
      } catch (e) {
        console.log(e);
      }

      p_arr.push(p1);
      otherAppointInfo.forEach((item) => {
        console.log("item: ", item);
        console.log(
          "test",
          item.openid,
          item.createTime,
          rejectReason,
          item.isban,
          item.choosed
        );

        // 先判断当前预约是否已经被处理过，即看 isban 字段
        // 如果被处理过，则不处理了
        // if (item.choosed) {
        //   // 说明当前的申请是给予通过的
        // }
        if (!item.isban) {
          let p = null;
          if (item.choosed) {
            p = updateUserAppointInfo2({
              openid: item.openid,
              createTime: item.createTime,
              rejectReason,
              isAgree: 1,
            });
          } else {
            p = updateUserAppointInfo2({
              openid: item.openid,
              createTime: item.createTime,
              rejectReason,
              isAgree: -1,
            });
          }
          p_arr.push(p);
          // p_arr.push(p_message);
        }
      });
      console.log("p_arr: ", p_arr);
      // 发请求
      Promise.all(p_arr)
        .then((res) => {
          console.log(res);
          this.$emit("event");
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    initData() {
      this.loading = true;
      this.tableData = [...this.listData];
      this.total = this.tableData.length;
      console.log("tableData", this.tableData);
      setTimeout(() => {
        this.loading = false;
      }, 500);
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

  /deep/.el-table {
    text-align: left;

    .el-button {
      width: 50px;

      span {
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
