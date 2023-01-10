// pages/conditionSearch/conditionSearch.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], // 周表
    roomType: ["教室", "面试间", "笔试间", "校企合作基地", "会议室", "培训室", "宣讲室"],
    roomTypeCodeIndex: 0,
    dateList: [], // 日期列表
    dateTimeStamp: [],  // 日期对应的时间戳
    dateListCodeIndex: 0,
    status: ['空闲', '已预约'],
    statusCodeIndex: 0,
    roomPeople: null, // 教室人数
    time: ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'], // 时间段
    timeCodeIndex: 0,
    roomInfo: [],
    roomAppointInfo: [],
    result: [], // 搜索结果
    openid: '',
    isEmployee: false, // 判断是否是企业用户
    isAdmin: false, // 判断是否是管理员
    first: 1,
    role: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.isAdmin();
    this.userRole();
    // this.isEmployee();
    this.getDefaultDate();
    // this.getRoomInfo();
    // this.getRoomAppointInfo();
  },

  // 判断用户类型
  userRole() {
    let {role} = this.data;
    // 先看是不是管理员
    if (app.globalData.isAdmin) {
      role = 'admin';
    } else {
      role = wx.getStorageSync('job');
    }
    this.setData({
      role,
    })
  },

  // 判断是否是管理员
  isAdmin() {
    this.setData({
      isAdmin: app.globalData.isAdmin,
      openid: app.globalData.openid,
    })
  },

  isEmployee() {
    let {
      openid
    } = this.data;
    wx.cloud.database().collection('employeeInfo')
      .get()
      .then(res => {
        console.log(res);
        // this.setData({
        //   employeeInfo: res.data,
        // })
        let employeeInfo = res.data;
        let isEmployee = false;
        employeeInfo.forEach(item => {
          if (item.openid === openid && item.isProve === 1) {
            isEmployee = true;
            this.setData({
              isEmployee
            })
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取未来一周的日期
  getDefaultDate() {
    const {
      weekday,
      dateTimeStamp
    } = this.data;
    const myDate = new Date();
    let dateList = [];
    for (let i = 0; i < 7; i++) {
      let currentWeekday = myDate.getDay();
      weekday.forEach((item, index) => {
        if (currentWeekday === index) {
          currentWeekday = item;
        }
      })
      let tempDate = (myDate.getMonth() + 1 + '/' + myDate.getDate() + ' ' + currentWeekday);
      let timeStamp = new Date(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()).getTime();
      dateList.push(tempDate);
      dateTimeStamp.push(timeStamp);
      myDate.setDate(myDate.getDate() + 1);
    }
    this.setData({
      dateList,
      dateTimeStamp
    })
  },

  // 获取教室信息
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
        // this.init();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取教室预约信息
  getRoomAppointInfo() {
    wx.cloud.database().collection('roomAppointInfo')
      .get()
      .then(res => {
        console.log(res);
        this.setData({
          roomAppointInfo: res.data,
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取用户选择的教室类型
  roomTypeChoose(e) {
    console.log(e);
    this.setData({
      roomTypeCodeIndex: e.detail.value * 1,
    })
  },

  // 获取用户选择的日期
  dateChoose(e) {
    console.log(e);
    this.setData({
      dateListCodeIndex: e.detail.value * 1,
    })
  },

  // 获取用户选择的教室状态
  statusChoose(e) {
    console.log(e);
    this.setData({
      statusCodeIndex: e.detail.value * 1,
    })
  },

  // 获取用户填写的人数
  getRoomPeople(e) {
    console.log(e);
    this.setData({
      roomPeople: e.detail.value * 1,
    })
  },

  // 获取用户选择的时间段
  timeChoose(e) {
    console.log(e);
    this.setData({
      timeCodeIndex: e.detail.value * 1,
    })
  },

  // 查询按钮点击事件
  handleSearchBtn() {
    this.setData({
      isSearch: true,
    })
    const {
      // roomInfo,
      // roomAppointInfo,
      roomType,
      roomTypeCodeIndex,
      dateList,
      dateListCodeIndex,
      dateTimeStamp,
      time,
      roomPeople,
      timeCodeIndex,
      // result
    } = this.data;
    // 获取选择的教室类型
    const chooseRoomType = roomType[roomTypeCodeIndex];
    console.log(chooseRoomType);
    // 获取选择的日期
    const chooseDate = dateList[dateListCodeIndex].split(" ")[0];
    console.log(chooseDate);
    // 获取选择的时间段
    const chooseTime = time[timeCodeIndex];
    console.log(chooseTime);
    // 获取选中日期的时间戳
    const timeStamp = dateTimeStamp[dateListCodeIndex];
    console.log(timeStamp);
    let result = []; // 搜索结果

    // 如果搜索的日期是今天，则看用户选择的时间段是否已经过期
    let day = new Date().getDay();
    let date = new Date().getDate();
    let currentDate = day + '/' + date;
    if (currentDate === chooseDate) {
      // 看选中的时间段是否过期
      let startTimeHour = parseInt(chooseTime.split('-')[0].split(':')[0]);
      let currentHour = new Date().getHours();
      if (startTimeHour <= currentHour) {
        return
      }
    }

    // 发两个请求去获取数据，
    // 1. 根据教室类型和所填写的人数去获取符合条件的教室
    let p1 = null;
    if (roomPeople !== null) {
      p1 = wx.cloud.database().collection('roomInfo')
      .where({
        roomType: chooseRoomType,
        roomPeople: wx.cloud.database().command.gte(roomPeople)
      })
      .get()
    } else {
      console.log(1);
      p1 = wx.cloud.database().collection('roomInfo')
      .where({
        roomType: chooseRoomType,
      })
      .get()
    }

    // 2. 根据日期时间戳去选择在数据库中有安排的记录
    let p2 = null;
    p2 = wx.cloud.database().collection('roomAppointInfo')
    .where({
      date: timeStamp,
    })
    .get()

    wx.showToast({
      title: '正在查询中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })


    Promise.all([p1, p2]).then(res => {
      wx.hideToast();
      console.log(res);
      const roomList = res[0].data;
      const appointedList = res[1].data;
      // 返回两个数组，有个是会议室的信息，一个是选中的日期的预约时间
      const map = new Map();
      if (roomList.length === 0) {
        return;
      }
      if (appointedList.length === 0) {
        // 所有日期均为空闲
        result = roomList.map(item => {
          item.currentStatus = '空闲';
          return item;
        })
      } else {
        // 把所有预约信息加入到 map 中
        appointedList.forEach(item => {
          map.set(item.roomid, item);
        })

        // 开始匹配会议室，看是否有已经安排的预约
        result = roomList.map(item => {
          if (map.has(item.roomid)) {
            // 查看当前时间段是否有安排
            item.currentStatus = map.get(item.roomid).appointArr[timeCodeIndex].status;
          } else {
            item.currentStatus = '空闲';
          }
          return item;
        })
      }
      console.log("result: ", result);
      this.setData({
        result,
      })
    }).catch(err => {
      wx.hideToast();
      console.log(err);
    })
    // roomInfo.forEach(item => {
    //   if (chooseRoomType === item.roomType) {
    //     console.log(item.roomType);
    //     for (let i = 0; i < roomAppointInfo.length; i++) {
    //       if (roomAppointInfo[i].roomid * 1 === item.roomid * 1) {
    //         console.log(item.roomid);
    //         if (roomAppointInfo[i].dateAppointInfo.length === 0) {
    //           // 说明都有空，都可以预约
    //           // 看人数符不符合要求
    //           console.log(item.roomPeople);
    //           if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
    //             item['currentStatus'] = '空闲';
    //             result.push(item);
    //             console.log(result);
    //           } else {
    //             if (roomPeople === '') {
    //               item['currentStatus'] = '空闲';
    //               result.push(item);
    //               console.log(result);
    //             }
    //           }
    //         } else {
    //           // 搜索日期，
    //           let hasDay = false;
    //           roomAppointInfo[i].dateAppointInfo.forEach(item1 => {
    //             if (item1.date === chooseDate) {
    //               hasDay = true;
    //               // 如果当前日期有安排，则再查看相应的时间段的状态
    //               item1.appointArr.forEach(item2 => {
    //                 let time = item2.time.startTime + '-' + item2.time.endTime;
    //                 if (time === chooseTime) {
    //                   // 再看人数是否合适
    //                   if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
    //                     console.log(roomPeople);
    //                     console.log(item.roomPeople);
    //                     item['currentStatus'] = '空闲';
    //                     result.push(item);
    //                     console.log(result);
    //                   } else {
    //                     if (roomPeople === '') {
    //                       item['currentStatus'] = '空闲';
    //                       result.push(item);
    //                       console.log(result);
    //                     }
    //                   }
    //                 }
    //               })
    //             }
    //           })
    //           // 遍历完之后仍然找不到对应的日期
    //           if (!hasDay) {
    //             // 再判断一次人数是否够
    //             if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
    //               console.log(roomPeople);
    //               console.log(item.roomPeople);
    //               item['currentStatus'] = '空闲';
    //               result.push(item);
    //               console.log(result);
    //             } else {
    //               if (roomPeople === '') {
    //                 item['currentStatus'] = '空闲';
    //                 result.push(item);
    //                 console.log(result);
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
    this.setData({
      result
    })
  },

  // 搜索结果条目点击事件
  /* 
    处理逻辑：
    先判断用户类型，如果不是认证用户或者管理员，则提示不是认证用户不给预约
    如果是认证用户或者管理员，则直接跳转到新建预约页面
  */
  handleRoomItem(e) {
    const {
      role,
      weekday
    } = this.data;
    console.log(e);
    let currentRoomid = e.currentTarget.dataset.roomid;
    let {
      dateList,
      dateListCodeIndex,
      time,
      first,
      timeCodeIndex
    } = this.data;
    let currentDate = dateList[dateListCodeIndex];
    let currentStartTime = time[timeCodeIndex].split("-")[0];
    let currentEndTime = time[timeCodeIndex].split("-")[1];
    const currentStatus = e.currentTarget.dataset.status;
    if (role === 'admin' || role === 'teacher' || role === 'student') {
      if (currentStatus !== '空闲') {
        return
      } else {
        console.log("携带参数跳转到教室预约页面");
        wx.navigateTo({
          url: '/pages/newAppointment/newAppointment?currentDate=' + currentDate + '&currentStartTime=' + currentStartTime + '&currentEndTime=' + currentEndTime + '&currentRoomid=' + currentRoomid + '&currentPage=' + 'newAppointment',
        })
      }
    } else {
      if (first === 1) {
        wx.showModal({
          title: '提示',
          content: '您不是企业用户，无法使用预约功能',
          confirmText: '不再提示',
          success: res => {
            if (res.confirm) {
              this.setData({
                first: 2
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return
      }
    }

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