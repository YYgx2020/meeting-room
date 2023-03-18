<template>
  <div class="container" v-loading.fullscreen="loading">
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

    <div>
      <el-dialog @open="onOpen" @close="onClose" title="新增教室" :visible="isshow">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">

          <div class="a">您可以在这里新增一个教室的信息</div>
          <div class="a">Tip:</div>
          <div class="a">1. <span class="t1">*</span> 为必填项</div>
          <div class="a t1">2. 会议室编号一旦输入并提交成功，则不予修改</div>

          <el-form-item label="编号" prop="id">
            <el-input v-model="formData.id" placeholder="请填写教室编号" clearable :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="r_name">
            <el-input v-model="formData.r_name" placeholder="请填写教室名称" clearable :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请填写教室联系人的姓名" clearable :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <el-form-item label="电话" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请填写教室联系人的电话号码" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请下拉选择" clearable :style="{ width: '100%' }">
              <el-option v-for="(item, index) in field103Options" :key="index" :label="item.label" :value="item.value"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="人数" prop="count">
            <el-input v-model="formData.count" placeholder="请填写教室可容纳的人数" clearable :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <el-form-item label="简介" prop="content">
            <el-input v-model="formData.field101" type="textarea" placeholder="请输入新增教室的简介"
              :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }"></el-input>
          </el-form-item>

          <div style="lineHeight:50px">
            <el-button type="primary">提交</el-button>
            <el-button type="warning">取消</el-button>
          </div>

        </el-form>
      </el-dialog>
    </div>
  </div>
</template>


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
      isshow: false,
      loading: true,
      formData: {
        id: '',
        r_name: '',
        name: '',
        mobile: '',
        type: '',
        count: '',
      },
      field103Options: [{
        "label": "教室",
        "value": 0
      },
      {
        "label": "面试间",
        "value": 1
      },
      {
        "label": "笔试间",
        "value": 2
      },
      {
        "label": "校企合作基地",
        "value": 3
      },
      {
        "label": "会议室",
        "value": 4
      },
      {
        "label": "培训室",
        "value": 5
      },
      {
        "label": "宣讲室",
        "value": 6
      }],

      rules: {
        id: [{
          required: true,
          message: '请输入教室编号',
          trigger: 'blur'
        }],
        r_name: [{
          required: true,
          message: '请输入教室名称',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入教室联系人姓名',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请下拉选择类型',
          trigger: 'change'
        }],
        count: [{
          required: true,
          message: '请输入教室可容纳人数',
          trigger: 'blur'
        }],

      },
    }
  },
  created() {
    this.loading = true

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
    setTimeout(() => {
      this.loading = false
    }, 1500);
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
      this.isshow = true
      // for (let index = 0; index < 2; index++) {
      //   this.roomList.push(this.roomInfo[index])

      // }
    },
    onOpen() { },
    onClose() {
      this.isshow = false;
      console.log('12312312321312312312312312gdfgdf');
      this.$refs['elForm'].resetFields()
    },
  },
}

</script>

<style lang="less" scoped>
.container {
  min-width: 650px;
  height: 100%;
  max-height: 40vh;

  .a {
    // color: red;
    // height: 30px;
    padding-left: 30px;
    text-align: left;
    line-height: 30px;

  }

  /deep/.el-dialog__header {
    line-height: 30px;
    padding: 10px 20px;
    max-width: 450px;

  }

  /deep/.el-dialog__body {
    padding: 0px 20px 20px;
    max-width: 450px;
    // min-width: 450px;
  }

  /deep/.el-form-item {
    margin-bottom: 15px;
  }

  .t1 {
    color: red;
  }

  .t2 {}

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

    background-color: #dbdbdb;
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
      right: 0px;
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
}
</style>