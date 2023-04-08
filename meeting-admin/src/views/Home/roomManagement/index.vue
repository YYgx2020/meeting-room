<template>
  <div class="container" v-loading.fullscreen="loading">
    <el-card :body-style="{ height: height + 'px', padding: '0px' }">
      <div slot="header">
        <div class="head">
          <span class="time">4/1 周五</span>
          <span>教室列表</span>
          <span class="serch">
            <el-input
              v-model="roomName"
              placeholder="查找 教室/会议室"
              size="mini"
            ></el-input>
          </span>
          <span class="addroom"
            ><el-button size="mini" @click="addroom">添加教室</el-button></span
          >
        </div>
      </div>

      <div class="list-box">
        <div class="list_item" v-for="(room, index) in roomList" :key="index">
          <el-card
            style="height: 100%"
            :body-style="{ padding: '0px', height: '100%' }"
            @click="editRoom(room)"
          >
            <span class="room_img" @click="editRoom(room)">
              <img :src="room.roomCoverImg" />
            </span>
            <div class="content">
              <span class="roomid">{{ room.roomid }}</span>
              <span class="roomT">{{ room.roomType }}</span>
            </div>

            <div class="content2">
              <div class="roomPeople">
                <span class="roomPeople_t1">可容纳人数</span>
                <span class="roomPeople_t2">{{ room.roomPeople }}</span>
              </div>
              <div class="delete">
                <el-button size="mini" @click="deleteRoom(room)" type="danger"
                  >删除</el-button
                >
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div>
        <el-dialog
          @open="onOpen"
          @close="onClose"
          title="新增教室"
          :visible="isshow"
        >
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="medium"
            label-width="100px"
          >
            <div class="a">您可以在这里新增一个教室的信息</div>
            <div class="a">Tip:</div>
            <div class="a">1. <span class="t1">*</span> 为必填项</div>
            <div class="a t1">2. 会议室编号一旦输入并提交成功，则不予修改</div>

            <el-upload
              v-if="!ImageUrl"
              action=""
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>

            <!-- <img width="100%" :src="ImageUrl" alt="" /> -->
            <el-image
              v-if="ImageUrl"
              style="width: 73%; "
              :src="ImageUrl"
              :preview-src-list="[ImageUrl]"
              fit="cover"
            ></el-image>

            <el-form-item label="编号" prop="id">
              <el-input
                v-model="formData.id"
                placeholder="请填写教室编号"
                clearable
                :style="{ width: '100%' }"
                :disabled="flag==='edit'"
              ></el-input>
            </el-form-item>

            <el-form-item label="名称" prop="r_name">
              <el-input
                v-model="formData.r_name"
                placeholder="请填写教室名称"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请填写教室联系人的姓名"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="mobile">
              <el-input
                v-model="formData.mobile"
                placeholder="请填写教室联系人的电话号码"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>

            <el-form-item label="类型" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请下拉选择"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in field103Options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="人数" prop="count">
              <el-input
                v-model="formData.count"
                placeholder="请填写教室可容纳的人数"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>

            <el-form-item label="简介" prop="content">
              <el-input
                v-model="formData.field101"
                type="textarea"
                placeholder="请输入新增教室的简介"
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>

            <div style="lineheight: 50px">
              <el-button type="primary" @click="commit">提交</el-button>
              <el-button type="warning" @click="cancel">取消</el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getRoomInfo,
  addRoomInfo,
  delRoomInfoItem,
  uploadCoverImg,
  updateRoomInfo,
} from "@/api";

export default {
  name: "room-management",
  components: {},
  data() {
    return {
      ImageUrl: "",
      roomInfo: [],
      roomList: [],
      roomName: "",
      isshow: false,
      loading: true,
      formData: {
        id: "",
        r_name: "",
        name: "",
        mobile: "",
        type: "",
        count: "",
        field101: "",
        room: "",
      },
      flag: "",
      field103Options: [
        {
          label: "教室",
          value: "教室",
        },
        {
          label: "面试间",
          value: "面试间",
        },
        {
          label: "笔试间",
          value: "笔试间",
        },
        {
          label: "校企合作基地",
          value: "校企合作基地",
        },
        {
          label: "会议室",
          value: "校企合作基地",
        },
        {
          label: "培训室",
          value: "培训室",
        },
        {
          label: "宣讲室",
          value: "宣讲室",
        },
      ],

      rules: {
        id: [
          {
            required: true,
            message: "请输入教室编号",
            trigger: "blur",
          },
        ],
        r_name: [
          {
            required: true,
            message: "请输入教室名称",
            trigger: "blur",
          },
        ],
        name: [
          {
            message: "请输入教室联系人姓名",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请下拉选择类型",
            trigger: "change",
          },
        ],
        count: [
          {
            required: true,
            message: "请输入教室可容纳人数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.loading = true;
    // 获取教室列表
    this.getRoomList();
  },
  watch: {
    roomName(newV, oldV) {
      // console.log(newV);
      if (newV) {
        this.roomList = [];
        this.roomInfo.forEach((item) => {
          if (
            (item.roomid + "").indexOf(newV) !== -1 ||
            (item.roomType + "").indexOf(newV) !== -1
          ) {
            this.roomList.push(item);
            // console.log('add');
          }
        });
      } else {
        // console.log('empty');
        this.roomList = [...this.roomInfo];
      }
    },
  },
  methods: {
    //修改教室信息
    editRoom(room) {
      this.flag = "edit";
      console.log(room);
      this.room = room;

      const {
        roomPeople: count,
        roomBriefInfo: field101,
        roomid: id,
        roomContactPhone: mobile,
        roomContactName: name,
        roomName: r_name,
        roomType: type,
      } = room;

      this.formData = {
        count,
        field101,
        id,
        mobile,
        name,
        r_name,
        type,
      };
      this.ImageUrl = room.roomCoverImg;
      this.isshow = true;
      // this.formData = { ...room };
      console.log(this.formData);
      // this.commit(this.formData)
    },
    //获取教室列表
    getRoomList() {
      getRoomInfo()
        .then((res) => {
          this.roomInfo = [];
          res.data.data.forEach((item) => {
            this.roomInfo.push(JSON.parse(item));
          });
          this.roomList = [...this.roomInfo];
          // console.log("thisroomInfo",this.roomInfo);
        })
        .catch((e) => {
          console.log(e);
        });
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
    //删除教室
    deleteRoom(room) {
      this.$baseConfirm(
        "确定删除此教室吗",
        null,
        async () => {
          await delRoomInfoItem({ roomid: room.roomid });
          this.$message({
            message: "删除成功",
            type: "success",
          });
          // console.log("this", this);
          this.getRoomList();
        },
        (e) => {
          console.log(e);
        }
      );
      // console.log(room);
    },
    //提交教室图片（未实现）
    beforeAvatarUpload(file) {
      const isJPG_PNG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG_PNG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (isJPG_PNG && isLt2M) {
        this.upload_flag = true;
        console.log(URL.createObjectURL(file));
        this.ImageUrl = URL.createObjectURL(file);
        uploadCoverImg({ tempFilePaths: this.ImageUrl }).then((res) => {
          console.log("res", res);
        });
      } else {
        this.upload_flag = false;
      }
      return isJPG_PNG && isLt2M;
    },
    //添加教室
    commit() {
      console.log("flag",this.flag);
      if (this.flag === "add") {
        const {
          count: roomPeople,
          field101: roomBriefInfo,
          id: roomid,
          mobile: roomContactPhone,
          name: roomContactName,
          r_name: roomName,
          type: roomType,
        } = this.formData;

        let data = {
          roomInfo: {
            fileID: "",
            roomPeople,
            roomCoverImg: "",
            roomType,
            roomName,
            roomContactPhone,
            roomContactName,
            roomBriefInfo,
            roomid,
          },
        };
        addRoomInfo(data)
          .then((res) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.isshow = false;
            console.log(res);
            this.getRoomList();
          })
          .catch((e) => console.log(e));
        console.log(data);
      } else {
      
        const {
          count: roomPeople,
          field101: roomBriefInfo,
          id: roomid,
          mobile: roomContactPhone,
          name: roomContactName,
          r_name: roomName,
          type: roomType,
        } = this.formData;

        let data = {
            fileID: this.room.fileID,
            roomPeople,
            roomCoverImg: this.room.roomCoverImg,
            roomType,
            roomName,
            roomContactPhone,
            roomContactName,
            roomBriefInfo,
            roomid:this.room.roomid,
        };
        console.log(data);

        updateRoomInfo(data)
          .then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.isshow = false;
            console.log(res);
            this.getRoomList();
          })
          .catch((e) => console.log(e));
      }
    },

    cancel() {
      this.isshow = false;
    },
    //按钮
    addroom() {
      this.isshow = true;
      this.flag = "add";
    },
    onOpen() {},
    onClose() {
      this.isshow = false;
      this.$refs["elForm"].resetFields();
      this.ImageUrl = "";
      this.formData = {
        id: "",
        r_name: "",
        name: "",
        mobile: "",
        type: "",
        count: "",
        field101: "",
      };
    },
  },
  computed: {
    height() {
      // console.log(this.$baseTableHeight());
      return this.$baseTableHeight();
    },
  },
};
</script>

<style lang="less" scoped>
// el-main {
//   line-height: 100px;
// }
.container {
  min-width: 650px;
  height: 100%;
  max-height: 40vh;
  line-height: normal;

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
    // max-width: 450px;
    // min-width: 450px;
  }

  /deep/.el-form-item {
    margin-bottom: 15px;
  }

  .t1 {
    color: red;
  }

  .t2 {
  }

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
    padding: 0 20px;

    img {
      height: 100px;
      width: 100px;
    }

    // background-color: #dbdbdb;
    .el-card__body {
      padding: 0px;
    }
  }

  .list-box {
    text-align: left;
    // height: 100%;

    .content {
      display: flex;
      flex-direction: column;
      position: absolute;
      margin-left: 110px;
      width: 100px;
      height: 50px;
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
    .content2 {
      display: flex;
      flex-direction: column;
      width: 100px;
      height: 100px;
      float: right;
      margin-right: 30px;
      justify-content: center;
      .delete {
        width: 28px;
      }
    }

    .roomPeople {
      display: flex;
      float: right;
      flex-direction: row;
      width: 180px;
      height: 50px;
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
