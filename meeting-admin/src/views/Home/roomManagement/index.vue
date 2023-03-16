<template>
  <div class="container">
    <div class="head">
      <span class="time">3/15 周三</span>
      <span>教室列表</span>
      <span class="serch">
        <el-input v-model="roomName" placeholder="查找 教室/会议室" size="mini"></el-input>
      </span>
      <span class="addroom"><el-button size="mini" @click="addroom">添加教室</el-button></span>
    </div>
    <div class="list-box">
      <div class="list_item" v-for="(room, index) in roomList" :key="index">

        <span class="room_img">
          <img :src="room.roomCoverImg">
        </span>
        <div class="content ">
          <span class="roomid">{{ room.roomid }}</span>
          <span class="roomT">{{ room.roomType }}</span>
        </div>

        <div class="roomPeople">
          <span class="roomPeople_t1">可容纳人数</span>
          <span class="roomPeople_t2">{{ room.roomPeople }}</span>
        </div>


      </div>

    </div>
  </div>
</template>

<view class="roomCoverImg">
  <image mode="aspectFill" src="{{item.roomCoverImg}}"></image>
</view>
<view class="content">
  <text class="roomId">{{item.roomid}}</text>
  <text class="roomType">{{item.roomType}}</text>
</view>
<!-- <view class="currentStatus">
  <text class="t1">当前状态: </text>
  <text class="t2 {{item.currentStatus === '已预约' && 't2_1'}} {{item.currentStatus === '空闲' && 't2_2'}}">{{item.currentStatus}}</text>
</view> -->
<view class="roomPeople">
  <text class="roomPeople_t1">可容纳人数: </text>
  <text class="roomPeople_t2">{{item.roomPeople}}</text>
</view>

<script>


import { getRoomInfo } from '@/api';

export default {
  name: 'room-management',
  components: {
    
  },
  data() {
    return {
      roomInfo: [],
      roomList: [],
      roomName: '',
    }
  },
  created() {
    // 获取教室列表
    getRoomInfo().then(res => {
      console.log('获取教室列表');

      console.log();

      res.data.data.forEach(item => {
        this.roomInfo.push(JSON.parse(item))
      })
      this.roomList = [...this.roomInfo]
      console.log(this.roomInfo);
    }).catch(e => {
      console.log(e);
    })

  },
  watch: {
    roomName(newV, oldV) {
      console.log(newV);
      if (newV) {
        this.roomList = []
        this.roomInfo.forEach(item => {
          if ((item.roomid + '').indexOf(newV) !== -1 || (item.roomType + '').indexOf(newV) !== -1) {
            this.roomList.push(item)
            console.log('add');
          }

        })
      }
      else {
        console.log('empty');
        this.roomList = [...this.roomInfo]

      }
    }


  },
  methods: {
    addroom() {
      console.log('this.roomName');
      for (let index = 0; index < 2; index++) {
        this.roomList.push(this.roomInfo[index])
        
      }
    }
  },
}

</script>

<style lang="less" scoped>
.container {
  height: 100%;
  max-height: 40vh;
  .head {
    height: 30px;
    line-height: 30px;

    .time {

      float: left;
    }

    .addroom {
      float: right;
      margin-right: 20px;
    }

    .serch {
      float: right;
      // margin-right: 20px;
    }


  }

  .list_item {
    height: 100px;
    margin-top: 20px;
    position: relative;

    img {
      height: 100px;
      width: 100px;
    }

    background-color: beige;
  }

  .list-box {
    text-align: left;
    // height: 100%;

    .content {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 110px;
      width: 100px;
      height: 100px;
      top: 0px;

      .roomid {
        height: 40px;
        flex: 1;
        line-height: 40px;
        font-weight: 800;
      }

      .roomT {
        height: 40px;
        line-height: 40px;
        flex: 1;
        color: gray;
      }
    }

    .roomPeople {
      display: flex;
      float: right;
      flex-direction: row;
      position: absolute;
      right: 100px;
      width: 180px;
      height: 100px;
      top: 0px;

      .roomPeople_t1 {
        height: 40px;
        flex: 1;
        line-height: 40px;
        width: 80px;
        font-weight: 800;
      }

      .roomPeople_t2 {
        height: 50px;
        line-height: 40px;
        flex: 1;
        width: 80px;
        color: gray;

      }
    }


  }
}</style>