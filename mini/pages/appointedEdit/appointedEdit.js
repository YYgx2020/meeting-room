// pages/appointedEdit/appointedEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], // 周表
    dateList: [], // 日期列表
    everydayAppoint: [], // 每天的安排
    userAppointInfo: [], // 用户的预约信息
    roomAppointInfo: [], // 所有教室的预约信息
    navId: 0, // 导航标识
    current: 0, // swiper的索引，默认显示第一个
    showMore: false, // 是否展示更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDefaultDate();
    this.getUserAppointInfo();
    this.getRoomAppointInfo();
    // 给点时间加载数据
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
      dateList.push({
        id: i,
        date: tempDate,
      });
      myDate.setDate(myDate.getDate() + 1);
    }
    this.setData({
      dateList
    })
  },

  // 获取用户预约表
  getUserAppointInfo() {
    wx.cloud.database().collection('userAppointInfo')
      .get()
      .then(res => {
        console.log(res);
        this.setData({
          userAppointInfo: res.data,
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取所有教室的预约表
  getRoomAppointInfo() {
    wx.cloud.database().collection('roomAppointInfo')
      .get()
      .then(res => {
        console.log(res);
        let roomAppointInfo = res.data;
        this.setData({
          roomAppointInfo,
        })
        this.dataInit();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 初始化数据，即从教室的预约表中找出各个日期的预约情况
  dataInit() {
    let everydayAppoint = [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    let {
      roomAppointInfo,
      dateList
    } = this.data;
    dateList.forEach((item1, index1) => {
      for (let i = 0; i < roomAppointInfo.length; i++) {
        if (roomAppointInfo[i].dateAppointInfo.length !== 0) {
          roomAppointInfo[i].dateAppointInfo.forEach(item2 => {
            if (item2.date === item1.date.split(" ")[0]) {
              item2.appointArr.forEach(item3 => {
                if (item3.status === '空闲' && item3.detail.length !== 0) {
                  // let tempItem = item3;  // 这里直接相等的话，会导致变量指向同一个内存地址
                  let tempItem = JSON.parse(JSON.stringify(item3));
                  tempItem.detail.forEach(item4 => {
                    console.log(item4);
                    item4['roomid'] = roomAppointInfo[i].roomid;
                    item4['applyStatus'] = '待审核';
                    // 将 showMore 变量放到这里来，就不会产生点击一个条目的更多信息，然后所有的都展开了
                    everydayAppoint[index1].push(item4);
                  })
                }
              })
            }
          })
        }
      }
    })
    this.setData({
      everydayAppoint
    })
  },

  // 导航栏点击事件
  changeNav(e) {
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    })
  },

  swiperChange(e) {
    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    this.setData({
      current: e.detail.current,
      navId: e.detail.current
    })
  },

  // 不同意按钮点击事件
  handleDisagree(e) {
    let currentAppointIndex = e.currentTarget.dataset.index;
    let currentAppoint = e.currentTarget.dataset.item;
    let {
      everydayAppoint,
      userAppointInfo,
      roomAppointInfo,
      current,
      dateList
    } = this.data;
    let currentDate = dateList[current].date.split(" ")[0];
    // 先处理 roomAppointInfo 里面的
    roomAppointInfo.forEach((item1, index) => {
      if (item1.roomid == currentAppoint.roomid) {
        item1.dateAppointInfo.forEach(item2 => {
          // 匹配日期
          if (item2.date === currentDate) {
            item2.appointArr.forEach(item3 => {
              item3.detail.forEach((item4, index4) => {
                if (item4.applyTime === currentAppoint.applyTime) {
                  // 将当前条目去掉
                  console.log(item3.detail);
                  console.log(item4);
                  item3.detail.splice(index4, 1);
                  console.log("已经删除");
                }
              })
            })
          }
        })

        // 更新数据库
        this.updateRoomAppointInfo(item1.roomid, item1.dateAppointInfo);
      }
    })

    // 处理用户预约表
    userAppointInfo.forEach(item1 => {
      if (item1.openid === currentAppoint.openid) {
        item1.appointArr.forEach(item2 => {
          if (item2.applyTime === currentAppoint.applyTime) {
            // 设置状态为不通过
            item2.isAgree = 1;
            console.log(item2);
          }
        })
        this.updateUserAppointInfo(item1.openid, item1.appointArr);
      }
    })

    // 处理页面的数据
    everydayAppoint.forEach((_item1, _index1) => {
      if (_index1 === current) {
        _item1.forEach((_item2, _index2) => {
          if (_index2 === currentAppointIndex) {
            // item1.splice(index2, 1); // 删除当前项
            // 将当前项的状态设置为不同意
            console.log(_item2);
            _item2.applyStatus = '不同意';
          }
        })
      }
    })

    // 将数据重新写回data中
    this.setData({
      everydayAppoint,
      userAppointInfo,
      roomAppointInfo,
    })
  },

  // roomAppointInfo 数据表更新操作
  updateRoomAppointInfo(roomid, dateAppointInfo) {
    wx.cloud.callFunction({
        name: 'updateRoomAppointInfo',
        data: {
          roomid,
          dateAppointInfo
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 更新用户的预约表（传入openid）
  updateUserAppointInfo(openid, appointArr) {
    wx.cloud.callFunction({
        name: 'updateUserAppointInfo',
        data: {
          openid,
          appointArr
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 同意按钮点击事件
  handleAgree(e) {
    console.log(e);
    // 先判断当前处理的时间段是否有冲突，
    // 即是否有不同的申请人同时申请同一教室、同一日期、同一时间段
    let currentAppointIndex = e.currentTarget.dataset.index;
    let currentAppoint = e.currentTarget.dataset.item;
    console.log(currentAppoint);
    let {
      everydayAppoint,
      userAppointInfo,
      roomAppointInfo,
      current,
      dateList
    } = this.data;
    let currentDate = dateList[current].date.split(" ")[0];
    roomAppointInfo.forEach(item1 => {
      if (item1.roomid == currentAppoint.roomid) {
        item1.dateAppointInfo.forEach(item2 => {
          // 匹配日期
          if (item2.date === currentDate) {
            item2.appointArr.forEach(item3 => {
              // 应该是先判断申请的时间段是否匹配，如果匹配再继续判断申请时间，而不是直接看申请时间
              if (item3.time.startTime == currentAppoint.time.startTime && item3.time.endTime == currentAppoint.time.endTime) {
                let tempItem = '';
                console.log("当前预约条目匹配成功");
                // 查看当前时间段是否被多人申请
                if (item3.detail.length > 1) {
                  console.log("当前教室的当前时间段有多人预约，需要另外处理");
                  item3.detail.forEach(item4 => {
                    // 如果当前
                    if (item4.applyTime === currentAppoint.applyTime) {
                      tempItem = item4;
                    }
                  })
                  item3.detail = tempItem;
                  item3.status = '已预约';
                  userAppointInfo.forEach(item5 => {
                    item5.appointArr.forEach(item6 => {
                      if (item6.time.date == dateList[current].date && item6.time.startTime == currentAppoint.time.startTime && item6.time.endTime == currentAppoint.time.endTime && item5.openid == currentAppoint.openid) {
                        console.log("当前用户的time和openid都相等，继续看申请时间，因为同一个用户可能在一个时间点上预约多次");
                        if (item6.applyTime == currentAppoint.applyTime) {
                          console.log("修改企业用户的预约状态");
                          item6.isAgree = 2;
                        } else {
                          item6.isAgree = 1;
                        }
                        // 更新用户信息
                        console.log("更新用户的预约信息");
                        this.updateUserAppointInfo(item5.openid, item5.appointArr);
                      } else if (item6.time.date == dateList[current].date && item6.time.startTime == currentAppoint.time.startTime && item6.time.endTime == currentAppoint.time.endTime && item5.openid != currentAppoint.openid) {
                        item6.isAgree = 1;
                        // 更新用户的预约信息
                        console.log("更新用户的预约信息");
                        this.updateUserAppointInfo(item5.openid, item5.appointArr);
                      }
                    })
                  })
                } else {
                  console.log("当前时间段只有一人预约，将其申请状态为通过，并更新教室的信息");
                  let userOpenid = ''
                  let userAppointArr = []
                  userAppointInfo.forEach((item4, index4) => {
                    // 先看openid
                    if (item4.openid === currentAppoint.openid) {
                      item4.appointArr.forEach(item5 => {
                        if (item5.applyTime === currentAppoint.applyTime) {
                          // 将其申请状态设置为2
                          item5.isAgree = 2;
                          // 将openid和appointArr提取出来
                          userOpenid = item4.openid
                          userAppointArr = item4.appointArr
                        }
                      })
                    }
                  })
                  // 更新数据库
                  console.log("更新用户的预约信息");
                  console.log(userOpenid);
                  console.log(userAppointArr);
                  this.updateUserAppointInfo(userOpenid, userAppointArr);
                  // 更新教室的预约信息
                  console.log("更新教室的预约信息");
                  item3.status = '已预约';
                  tempItem = item3.detail[0];
                  item3.detail = tempItem;
                }
              }
            })
          }
        })

        // 更新数据库
        console.log("更新所有教室的预约信息");
        this.updateRoomAppointInfo(item1.roomid, item1.dateAppointInfo);
      }
    })

    // 更新页面数据
    let selectRoomid = ''; // 选中处理条目的教室id
    let selectTime = ''; // 选中处理条目的时间
    everydayAppoint.forEach((item1, index1) => {
      if (index1 === current) {
        item1.forEach((item2, index2) => {
          if (index2 === currentAppointIndex) {
            console.log(item2);
            item2.applyStatus = '同意';
            console.log(item2);
            console.log("当前项被同意申请");
            // 标记当前项的roomid和time
            selectRoomid = item2.roomid;
            selectTime = item2.time;
          }
        })

        // 重新检查一遍，看看有没有同一教室，同一时间段的
        item1.forEach((item2, index2) => {
          if (item2.roomid == item2.roomid && selectTime.startTime == item2.time.startTime && index2 !== currentAppointIndex) {
            item2.applyStatus = '不同意';
          }
        })
      }
    })

    // 将数据重新写回data中
    this.setData({
      everydayAppoint,
      userAppointInfo,
      roomAppointInfo,
    })
  },

  handleShowMore() {
    console.log("查看更多");
    this.setData({
      showMore: !this.data.showMore,
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