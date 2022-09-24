// pages/addRoom/addRoom.js
const app = getApp();

/* 
本页面有很多bug待更改，
页面逻辑：
1. 先判断是从哪个页面跳转过来的
  - 如果是从会议室列表页面跳转过来的，则不携带任何参数。
  - 如果是从具体的会议室页面跳转过来的，则会携带会议室的id，根据id去获取该会议室的信息并展示到页面上（获取单条记录），供管理员进行编辑更新操作。

如果是要新增会议室记录，那么提交的时候要查看该会议室的编号是否已经存在，如果存在则不予新增

更新的时候也一样，如果存在，则不予更新。
*/



Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    currentRoomid: '',
    isAdmin: false,
    roomInfo: [],
    roomid: '', // room编号
    roomName: '', // room名称
    roomContactName: '', // room 联系人姓名
    roomContactPhone: '', // room 联系人电话
    phoneError: false,
    roomType: ["教室", "面试间", "笔试间", "校企合作基地", "会议室", "培训室", "宣讲室"],
    roomTypeChoose: '教室', // 用户选中的room类型，默认是教室
    roomPeople: '',
    roomTypeCodeIndex: 0,
    briefText: '', // 简介信息
    fileID: '', // 图片 fileID
    tempFilePaths: '', // 展示的图片链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (Object.keys(options).length === 0) {
      // 当前是从教室列表页跳转过来的
      console.log("当前是从教室列表页跳转过来的");
    } else {
      console.log(options.roomid);
      this.setData({
        currentRoomid: options.roomid,
      })
    }
    console.log(options);
    wx.showLoading({
      title: '加载中',
    })
    // 向数据库发送请求获取 roomInfo
    this.getRoomInfo();
  },

  // 如果携带了 roomid 则初始化页面
  init() {
    let {
      currentRoomid,
      roomType
    } = this.data;
    if (currentRoomid === '') {
      return
    } else {
      console.log("1");
      // 填充页面数据
      let {
        roomInfo
      } = this.data;
      console.log(this.data);
      let currentRoomInfo = [];
      console.log(roomInfo);
      for (let i = 0; i < roomInfo.length; i++) {
        if (roomInfo[i].roomid + '' === currentRoomid) {
          currentRoomInfo = roomInfo[i];
          break
        }
      }
      console.log(currentRoomInfo);
      // 匹配当前教室的类型
      for (let i = 0; i < roomType.length; i++) {
        if (currentRoomInfo.roomType === roomType[i]) {
          console.log(i);
          this.setData({
            roomTypeCodeIndex: i,
          })
        }
      }
      // 获取教室的封面
      wx.cloud.getTempFileURL({
          fileList: [{
            fileID: currentRoomInfo.fileID,
          }]
        })
        .then(res => {
          console.log(res.fileList);
          this.setData({
            tempFilePaths: res.fileList[0].tempFileURL,
            roomPeopleTipValue: currentRoomInfo.roomPeople,
            roomidValue: currentRoomInfo.roomid,
            roomid: currentRoomInfo.roomid + '',
            roomNameValue: currentRoomInfo.roomName,
            roomName: currentRoomInfo.roomName,
            roomContactNameValue: currentRoomInfo.roomContactName,
            roomContactName: currentRoomInfo.roomContactName,
            roomContactPhoneValue: currentRoomInfo.roomContactPhone,
            roomContactPhone: currentRoomInfo.roomContactPhone,
            briefIntroductionValue: currentRoomInfo.roomBriefInfo,
            briefText: currentRoomInfo.roomBriefInfo,
          })
        })
        .catch(err => {
          console.log(err);
        })



    }
  },

  // 上传图片功能
  handleChooseImage() {
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
      count: 1, // 默认为9
      sizeType: ['original'], // 指定原图或者压缩图
      sourceType: ['album'], // 指定图片来源
      success: chooseResult => {
        let tempFilePaths = chooseResult.tempFilePaths[0];
        this.setData({
          tempFilePaths,
        })
      }
    })
  },

  // 获取 roomInfo
  getRoomInfo() {
    // 向数据库请求 roomInfo
    wx.cloud.callFunction({
        name: 'getRoomInfo',
      })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          roomInfo: res.result.data
        })
        // 初始化页面数据
        this.init();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取用户输入的 room 编号
  getRoomid(e) {
    console.log(e);
    this.setData({
      roomid: e.detail.value
    })
    // 上传图片
    if (e.detail.value) {
      this.uploadCoverImg();
    }
  },

  // 获取用户输入的 room 名称
  getRoomName(e) {
    this.setData({
      roomName: e.detail.value
    })
  },

  // 获取用户输入的 room 联系人姓名
  getRoomContactName(e) {
    this.setData({
      roomContactName: e.detail.value
    })
  },

  // 获取 room 联系人的电话号码
  getRoomContactPhone(e) {
    // 对电话号码进行合法性检测
    let myreg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(16([0-9]))|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9|5]))\d{8}$/;
    if (e.detail.value.length === 0) {
      return
    }
    console.log(e.detail.value.length);
    if (e.detail.value.length <= 10 && e.detail.value.length > 0) {
      console.log(2);
      // 提示用户输入电话号码
      // wx.showToast({
      //   title: '请输入正确的电话号码',
      //   icon: 'none',
      // })
      this.setData({
        phoneError: true,
      })
    } else {
      console.log(myreg.test(e.detail.value));
      if (!myreg.test(e.detail.value)) {
        // 如果正则匹配失败，则继续提示用户输入合法的电话号码
        // wx.showToast({
        //   title: '请输入正确的电话号码',
        //   icon: 'none',
        // })
        this.setData({
          phoneError: true,
        })
      } else {
        this.setData({
          roomContactPhone: e.detail.value,
          phoneError: false,
        })
      }
    }
  },

  // room类型选择绑定事件
  bindPicker3Change(e) {
    // console.log(e.detail.value);
    let {
      roomType
    } = this.data;
    this.setData({
      roomTypeCodeIndex: e.detail.value * 1,
      roomTypeChoose: roomType[e.detail.value * 1],
    })
  },

  // 获取教室人数
  getRoomPeople(e) {
    this.setData({
      roomPeople: e.detail.value
    })
  },

  // 监听键盘文本输入完毕
  getRoomBriefInfo(e) {
    console.log("文本域输入完毕：", e.detail.value);
    let briefText = e.detail.value;
    this.setData({
      briefText
    })
  },

  // 文本域失去焦点时，也更新data中的 briefText
  textareaLostFocus(e) {
    console.log("文本域失去焦点：", e.detail.value);
    let briefText = e.detail.value;
    this.setData({
      briefText
    })
  },

  // 提交按钮
  handleConfirm() {
    console.log("用户点击了提交按钮");
    // 进行合法性检测
    // 1. 先检查必填项是否已经填写
    let {
      roomid,
      roomName,
      roomContactName,
      roomContactPhone,
      roomTypeChoose,
      briefText,
      roomPeople,
      phoneError
    } = this.data;
    if (phoneError) {
      return
    }
    if (roomid === '') {
      // 提示管理员roomid是必填项
      wx.showToast({
        title: '请输入新增教室的编号，否则无法提交',
        icon: 'none',
        duration: 3000,
      })
      return
    } else if (roomName === '') {
      wx.showToast({
        title: '请输入新增教室的名称，否则无法提交',
        icon: 'none',
        duration: 3000,
      })
      return
    } else if (roomTypeChoose === '') {
      wx.showToast({
        title: '请选择教室的类型，否则无法提交',
        icon: 'none',
        duration: 3000,
      })
      return
    } else if (roomPeople === '') {
      wx.showToast({
        title: '请输入教室可容纳的人数，否则无法提交',
        icon: 'none',
        duration: 3000,
      })
      return
    } else {
      // 否则查看其他信息是否填写
      if (roomContactName === '' || roomContactPhone === '') {
        // 提示管理员
        wx.showModal({
          title: '温馨提示',
          content: '当前教室的联系人信息不完整，为了方便管理，建议您输入一份完整的联系人信息',
          confirmText: '返回填写',
          cancelText: '不填写',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定');
              // 如果管理员点击了确定，则返回页面，让管理员输入联系人信息
              return
            } else if (res.cancel) {
              console.log('用户点击取消');
              // 如果管理员点击取消，则直接提交
              this.formConfirm();
            }
          }
        })
      } else {
        // 如果都填了，那也要查询
        console.log(1);
        this.formConfirm();
        // 
      }
    }
  },

  // 上传图片
  uploadCoverImg() {
    let {
      roomid,
      tempFilePaths
    } = this.data;
    if (tempFilePaths === '') {
      // 用户没有上传图片
      return
    } else {
      // 将图片上传至云存储空间
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: 'roomCoverImage/' + roomid + '.png',
        // 指定要上传的文件的小程序临时文件路径
        filePath: tempFilePaths,
        // 成功回调
        success: res1 => {
          console.log("上传成功", res1);
          // 获取图片的url
          if (res1.fileID) {
            console.log(res1.fileID);
            wx.cloud.getTempFileURL({
                fileList: [{
                  fileID: res1.fileID,
                }]
              })
              .then(res3 => {
                console.log(res3.fileList);
                let roomCoverImg = res3.fileList[0].tempFileURL;
                this.setData({
                  fileID: res1.fileID,
                  roomCoverImg,
                })
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
      })
    }
  },

  // 表单提交信息确认
  formConfirm() {
    const {
      fileID,
      roomPeople,
      roomid,
      roomName,
      roomContactName,
      roomContactPhone,
      roomTypeChoose,
      briefText,
      roomInfo,
      currentRoomid,
      roomCoverImg
    } = this.data;
    let roomidExist = false;
    // 1. 先判断是否存在当前room，如果存在，则提示管理员是否要更新该room的信息

    console.log(typeof roomid);
    for (let i = 0; i < roomInfo.length; i++) {
      if (roomid === (roomInfo[i].roomid + '')) {
        // 更新单条数据
        roomInfo[i].roomPeople = roomPeople;
        roomInfo[i].fileID = fileID;
        roomInfo[i].roomName = roomName;
        roomInfo[i].roomContactName = roomContactName;
        roomInfo[i].roomContactPhone = roomContactPhone;
        roomInfo[i].roomType = roomTypeChoose;
        roomInfo[i].roomBriefText = briefText;
        roomInfo[i].roomCoverImg = roomCoverImg;
        // 如果是从教室详情页跳转过来的，则直接问管理员确定是否要更新数据，无需再提示教室已经存在
        if (currentRoomid !== '') {
          console.log("1");
          wx.showModal({
            title: '提示',
            content: '确定要更新当前教室的信息吗',
            success: res => {
              if (res.confirm) {
                console.log("确定要更新");
                console.log("用户想要更新当前教室的信息");
                console.log(roomInfo[i]);
                // 2. 把管理员填写的数据更新到数据库中
                wx.showLoading({
                  title: '上传中',
                })
                this.updateRoomInfo(roomInfo[i]);
              } else if (res.cancel) {
                console.log("用户取消更新");
              }
            }
          })
        } else {
          console.log(1);
          wx.showModal({
            title: '提示',
            content: '当前教室已经存在，确定要更新当前教室的信息吗',
            success: res => {
              if (res.confirm) {
                console.log("确定要更新");
                console.log("用户想要更新当前教室的信息");
                console.log(roomInfo[i]);
                // 2. 把管理员填写的数据更新到数据库中
                wx.showLoading({
                  title: '上传中',
                })
                this.updateRoomInfo(roomInfo[i]);
              } else if (res.cancel) {
                console.log("用户取消更新");
              }
            }
          })
        }

        roomidExist = true;
        break
      }
    }

    // 遍历完之后查看 roomid 是否存在的标志，不存在则向数据库中的roomInfo表新增一个room的信息
    if (!roomidExist) {
      // 插入一条 room 数据
      const roomInfo = {
        fileID: fileID,
        roomPeople: roomPeople,
        roomid: roomid * 1,
        roomName: roomName,
        roomContactName: roomContactName,
        roomContactPhone: roomContactPhone * 1,
        roomType: roomTypeChoose,
        roomBriefInfo: briefText,
        roomCoverImg: roomCoverImg,
      };
      // 询问管理员是否确定提交
      wx.showModal({
        title: '提示',
        content: '确认提交吗',
        success: res => {
          if (res.confirm) {
            wx.showLoading({
              title: '上传中',
            })
            this.addRoomInfo(roomInfo);
          } else if (res.cancel) {
            return
          }
        }
      })
    }

    this.getDateAppointList(roomid);

  },

  // 调用云函数获取当前教室的相关预约信息
  getDateAppointList(roomid) {
    wx.cloud.database().collection('roomAppointInfo')
      .get()
      .then(res => {
        console.log(res);
        let isExit = false;
        let roomAppointInfo = res.data;
        roomAppointInfo.forEach(item => {
          if (item.roomid === roomid) {
            isExit = true;
          }
        })
        if (isExit) {
          return;
        } else {
          // 给roomAppointInfo表新增一个教室的字段
          this.addRoomAppointInfo(roomid);
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  // roomAppointInfo 表新增操作
  addRoomAppointInfo(roomid) {
    wx.cloud.callFunction({
        name: 'addRoomAppointInfo',
        data: {
          roomid
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // roomInfo更新操作
  updateRoomInfo(roomInfo) {
    let {
      currentRoomid
    } = this.data;
    console.log(roomInfo);
    wx.cloud.callFunction({
        name: 'updateRoomInfo',
        data: {
          fileID: roomInfo.fileID,
          roomPeople: roomInfo.roomPeople,
          roomid: roomInfo.roomid,
          roomType: roomInfo.roomType,
          roomName: roomInfo.roomName,
          roomContactPhone: roomInfo.roomContactPhone,
          roomContactName: roomInfo.roomContactName,
          roomBriefInfo: roomInfo.roomBriefText,
        }
      })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        // 3. 跳转回教室详情页
        wx.navigateBack({
          url: '/pages/roomDetail2/roomDetail2?roomid=' + currentRoomid,
        })
        // 4. 提示管理员提交成功
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // roomInfo数据表插入操作
  addRoomInfo(roomInfo) {
    wx.cloud.callFunction({
        name: 'addRoomInfo',
        data: {
          roomInfo
        }
      })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        // 跳转回room列表页面
        wx.navigateBack({
          url: '/pages/roomsEdit/roomsEdit',
        })
        // 提示管理员提交成功
        wx.showToast({
          title: '新增成功',
          icon: 'success'
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})