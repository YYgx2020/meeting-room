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
    dateListCodeIndex: 0,
    status: ['空闲', '已预约'],
    statusCodeIndex: 0,
    roomPeople: 0, // 教室人数
    time: ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'], // 时间段
    timeCodeIndex: 0,
    roomInfo: [],
    roomAppointInfo: [],
    result: [], // 搜索结果
    openid: '',
    isEmployee: false, // 判断是否是企业用户
    isAdmin: false, // 判断是否是管理员
    first: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isAdmin();
    this.isEmployee();
    this.getDefaultDate();
    this.getRoomInfo();
    this.getRoomAppointInfo();
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
      weekday
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
      dateList.push(tempDate);
      myDate.setDate(myDate.getDate() + 1);
    }
    this.setData({
      dateList
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
      roomInfo,
      roomAppointInfo,
      roomType,
      roomTypeCodeIndex,
      dateList,
      dateListCodeIndex,
      time,
      roomPeople,
      timeCodeIndex
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

    let result = []; // 搜索结果
    roomInfo.forEach(item => {
      if (chooseRoomType === item.roomType) {
        console.log(item.roomType);
        for (let i = 0; i < roomAppointInfo.length; i++) {
          if (roomAppointInfo[i].roomid * 1 === item.roomid * 1) {
            console.log(item.roomid);
            if (roomAppointInfo[i].dateAppointInfo.length === 0) {
              // 说明都有空，都可以预约
              // 看人数符不符合要求
              console.log(item.roomPeople);
              if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
                item['currentStatus'] = '空闲';
                result.push(item);
                console.log(result);
              } else {
                if (roomPeople === '') {
                  item['currentStatus'] = '空闲';
                  result.push(item);
                  console.log(result);
                }
              }
            } else {
              // 搜索日期，
              let hasDay = false;
              roomAppointInfo[i].dateAppointInfo.forEach(item1 => {
                if (item1.date === chooseDate) {
                  hasDay = true;
                  // 如果当前日期有安排，则再查看相应的时间段的状态
                  item1.appointArr.forEach(item2 => {
                    let time = item2.time.startTime + '-' + item2.time.endTime;
                    if (time === chooseTime) {
                      // 再看人数是否合适
                      if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
                        console.log(roomPeople);
                        console.log(item.roomPeople);
                        item['currentStatus'] = '空闲';
                        result.push(item);
                        console.log(result);
                      } else {
                        if (roomPeople === '') {
                          item['currentStatus'] = '空闲';
                          result.push(item);
                          console.log(result);
                        }
                      }
                    }
                  })
                }
              })
              // 遍历完之后仍然找不到对应的日期
              if (!hasDay) {
                // 再判断一次人数是否够
                if (roomPeople !== '' && item.roomPeople * 1 >= roomPeople * 1) {
                  console.log(roomPeople);
                  console.log(item.roomPeople);
                  item['currentStatus'] = '空闲';
                  result.push(item);
                  console.log(result);
                } else {
                  if (roomPeople === '') {
                    item['currentStatus'] = '空闲';
                    result.push(item);
                    console.log(result);
                  }
                }
              }
            }
          }
        }
      }
    });
    this.setData({
      result
    })
  },

  // 搜索结果条目点击事件
  handleRoomItem(e) {
    const {
      isAdmin,
      isEmployee,
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
    if (isAdmin || isEmployee) {
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