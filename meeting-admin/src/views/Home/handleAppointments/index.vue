<!--
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-20 18:43:34
-->
<template>
  <div class="handle-appoinement">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">处理预约</span>
      </el-tab-pane>

      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="serch" placeholder="姓名或电话号码" size="mini" />
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
        <listItem :listData="list" :serchValue="serchValue"></listItem>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import listItem from './componet/listItem';
import { getUserAppointInfo, getRoomAppointInfo } from '@/api';
export default {
  name: 'Home',
  components: {
    listItem,
  },

  data() {
    return {
      list: [],
      week: [],
      serch: '',
      serchValue: '',
    };
  },
  created() {
    // 获取预约总数
    // console.log('获取预约总数');
    // this.getCount()
    getUserAppointInfo().then((res) => {
      // console.log('jjjjjj');
      // console.log(res);
    });
    //设置本周时间
    this.setWeek();
    //获取本周预约列表
    this.setAppointInfoList();
  },
  methods: {
    setWeek() {
      const myDate = new Date();
      let dateList = [];
      for (let i = 0; i < 7; i++) {
        let currentWeekday = myDate.getDay();
        let tempDate =
          myDate.getMonth() + 1 + '/' + myDate.getDate() + ' ' + currentWeekday;
        let time = new Date(
          myDate.getFullYear() +
            '-' +
            (myDate.getMonth() + 1) +
            '-' +
            myDate.getDate()
        ).getTime();
        dateList.push({
          id: i,
          date: tempDate,
          time,
        });
        myDate.setDate(myDate.getDate() + 1);
      }
      this.week = dateList;
      // console.log('dataList');
      // console.log(dateList);
      // this.getRoomAppointInfoList(dateList[0].time)
    },

    //获得当天预约
    getRoomAppointInfoList(time) {
      return getRoomAppointInfo(time);
    },

    setAppointInfoList() {
      let Promise_Appoint = [];

      for (let i = 0; i < this.week.length; i++) {
        Promise_Appoint.push(this.getRoomAppointInfoList(this.week[i].time));
      }
      let Appoint_res = Promise.all([...Promise_Appoint]).then((res) => {
        // console.warn('appoint_res');
        // console.log(res);

        let templist = [];
        res.forEach((item) => {
          let t = item.data.data;
          t.forEach((i) => {
            templist.push(JSON.parse(i));
          });
        });
        // console.log('templist');
        // console.log(templist);
        //拿到预约列表
        let data = [];
        for (let item of templist) {
          let appointArr = item.appointArr;
          for (let i = 0; i < appointArr.length; i++) {
            if (
              appointArr[i].status === '空闲' &&
              appointArr[i].detail.length !== 0
            ) {
              // data.push()
              // console.log(_item.detail);
              const detail = appointArr[i].detail;
              for (let j = 0; j < detail.length; j++) {
                detail[j].roomid = item.roomid;
                detail[j].firstIndex = i;
                detail[j].secondIndex = j;
                detail[j].showMore = true;
                data.push(detail[j]);
              }
            }
          }
        }
        console.warn('data');
        console.log(data);
        this.list = data;
      });
    },
    handleQuery() {
      this.serchValue = this.serch;
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs__nav-scroll {
  height: 50px;
  line-height: 60px;
  text-align: center;

  .el-tabs__nav {
    float: none;
  }
}

.handle-appoinement {
  line-height: 20px;
}

/deep/ .el-form {
  float: right;
  height: 40px;
}

/deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 700;
  font-size: larger;
  border: none;
}

/deep/.el-tabs__content {
  // background-color: aqua;
  // line-height: 60px;

  padding: 0;
}
</style>
