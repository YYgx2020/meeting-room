/**
 * 教室详情页面需要的数据：
 *  1. roomAppointInfo 中的 dateAppointInfo
 *  2. 一份默认的安排表
 *
 */
const app = getApp();
const time = 518400000;  // 7 天的时间差

Page({
  data: {
    openid: '',
    first: 1, // 标记初次进入当前页面
    startTimeArr2: [
      ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      ['00', '30']
    ], // 增加时间的选择器
    disabled: false, // 是否禁用添加时间的按钮
    currentRoomid: '', // 当前 room 的编号
    addStartTime: '07:00', // 开始的时间
    addEndTime: '22:30', // 结束的时间
    addNewAppoint: true, // 增加空闲时间的标志
    navId: 0, // 导航标识
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], // 周表
    dateList: [],
    isAdmin: false, // 标记是否是管理员
    roomAppointArrList: [], // 当天的安排（数据库中存有的）
    current: 0, // swiper的索引，默认显示第一个
    currentIndex: '', // 暂存当前条目的索引
    btnListTouch: false, // 弹出层的判断标签
    isNone: false, // 处理预约 && 查看预约详情 弹出层的 弹出标志
    appointDetail: '', // 预约详情
    adminInfo: [], // 管理员openid列表
    isStudent: false,
    isTeacher: false,
    isEmployee: false, // 标志是否是企业用户
    defaultAppoint: [{
      time: {
        startTime: '08:00',
        endTime: '10:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '10:00',
        endTime: '12:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '12:00',
        endTime: '14:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '14:00',
        endTime: '16:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '16:00',
        endTime: '18:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '18:00',
        endTime: '20:00'
      },
      detail: [],
      status: '空闲',
    }, {
      time: {
        startTime: '20:00',
        endTime: '22:00'
      },
      detail: [],
      status: '空闲',
    }], // 一天默认的安排
    // showAppoint: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 关闭导航栏的刷新图标
    wx.hideNavigationBarLoading();
    // wx.hideLoading();
    // wx.stopPullDownRefresh();
    console.log(options.roomid);
    // 设置导航栏日期
    this.getDefaultDate();
    // 获取当前roomid的相关信息
    this.setData({
      currentRoomid: options.roomid,
      openid: app.globalData.openid,
    })
    if (options.current) {
      this.setData({
        current: options.current,
        navId: options.current,
      })
    }
    // wx.showLoading({
    //   title: '数据加载中',
    //   mask: true,
    // })
    // 判断当前用户的身份
    this.judgeIdentity()

    // 调用云函数获取当前教室的相关安排信息
    this.getDateAppointList();

    // // 初始化默认的日期安排
    // this.initDefaultAppoint(options.current);
  },

  // 判断当前用户身份
  judgeIdentity() {
    let {
      isStudent,
      isTeacher
    } = this.data
    let job = wx.getStorageSync('job')
    if (job == 'student') {
      isStudent = true;
    } else if (job == 'teacher') {
      isTeacher = true;
    }
    this.setData({
      isAdmin: app.globalData.isAdmin,
      isStudent,
      isTeacher,
    })

  },

  // 增加是否可以点击的属性
  initDefaultAppoint(current) {
    console.log(current);
    if (current == undefined) {
      current = 0;
    }
    let currentHour = new Date().getHours();
    let {
      defaultAppoint,
    } = this.data;
    if (current === 0) {
      defaultAppoint.forEach(item => {
        if (item.time.endTime.split(":")[0] * 1 <= currentHour) {
          item['isban'] = true;
        } else {
          item['isban'] = false;
        }
        item['detail'] = [];
        item['isAppointed'] = false;
      })
    } else {
      defaultAppoint.forEach(item => {
        item['detail'] = [];
        item['isban'] = false;
        item['isAppointed'] = false;
      })
    }
    this.setData({
      defaultAppoint
    })
  },

  // 获取七天后的日期
  getDefaultDate() {
    const {
      weekday
    } = this.data;
    const myDate = new Date(); // 获取今天的日期
    const dateList = [];
    for (let i = 0; i < 7; i++) {
      let currentWeekday = myDate.getDay();
      weekday.forEach((item, index) => {
        if (currentWeekday === index) {
          currentWeekday = item;
        }
      })
      let dateTemp = (myDate.getMonth() + 1) + '/' + myDate.getDate() + ' ' + currentWeekday;
      let timeStamp = new Date(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()).getTime();
      dateList.push({
        id: i,
        date: dateTemp,
        timeStamp,  // 增加一个时间戳，方便后续处理预约信息时进行时间的对比
      });
      myDate.setDate(myDate.getDate() + 1);
    }
    this.setData({
      dateList
    })
  },

  // 调用云函数获取当前教室的相关预约信息
  /* 
    1. 根据当前会议室的 id 以及当前日期的时间戳和7天后的时间戳去数据库获取这7天内，该会议室的预约信息
    2. 然后再将这些会议室的信息填到对应日期的时间段中
      - 对于非管理员用户，如果该时间段的预约没有通过，则不显示，可以继续预约
      - 如果是管理员用户，则除了显示已经通过的预约信息以外，还将显示那些还没有处理的预约信息，以提醒管理员处理
  */
  getDateAppointList() {

    let {
      currentRoomid
    } = this.data;

    // 获取当前日期的时间戳
    const date = new Date();
    let startDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).getTime();
    console.log('startDate: ', startDate);
    let endDate = startDate + time;
    console.log('endDate: ', endDate);
    wx.showToast({
      title: '数据加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    // 这里预估预约信息应该不会超过 20 条，因此先不管超出后的情况
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('roomAppointInfo')
      .where({
        roomid: currentRoomid,
        date: _.gte(startDate).and(_.lte(endDate))
      })
      .get()
      .then(res => {
        wx.hideToast();
        console.log(res.data);
        this.setData({
          roomAppointArrList: res.data,
        })
        // 开始处理信息
        this.handleShowAppointInfo(res.data);
      })
      .catch(err => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '数据加载出错，请退出重试',
          success: res => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        console.log(err);
      })
    // wx.cloud.callFunction({
    //     name: 'getDateAppointList',
    //     data: {
    //       roomid: currentRoomid
    //     }
    //   })
    //   .then(res => {
    //     wx.hideLoading();
    //     console.log(res.result.data[0].dateAppointInfo);
    //     let dateAppointedList = res.result.data[0].dateAppointInfo;
    //     // 对 dateAppointedList 进行排序
    //     dateAppointedList = this.dateSort(dateAppointedList);
    //     this.setData({
    //       dateAppointedList
    //     })
    //     this.handleShowAppointInfo();
    //     // this.dataInit2();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  },

  // 对数据库中的日期进行排序
  dateSort(dateAppointedList) {
    for (let i = 0; i < dateAppointedList.length - 1; i++) {
      for (let j = 0; j < dateAppointedList.length - 1 - i; j++) {
        // 生成日期对象
        let a = new Date(dateAppointedList[j].date.split("/")[0] + '-' + dateAppointedList[j].date.split("/")[1]);
        let b = new Date(dateAppointedList[j + 1].date.split("/")[0] + '-' + dateAppointedList[j + 1].date.split("/")[1]);
        if (a > b) {
          let temp = dateAppointedList[j];
          dateAppointedList[j] = dateAppointedList[j + 1];
          dateAppointedList[j + 1] = temp;
        }
      }
    }
    console.log(dateAppointedList);
    return dateAppointedList;
  },

  // 预约信息处理
  handleShowAppointInfo(roomAppointArr) {
    let {
      // dateAppointedList,
      defaultAppoint,
      dateList,
      current,
      roomAppointArrList,
      // showAppoint
    } = this.data;
    if (roomAppointArr === 'undefined') {
      // 这里不要直接相等，因为 roomAppointArrList 是一个对象数组，直接传值会导致后面的变量跟其指向同一个地址，从而一起发生改变
      roomAppointArr = JSON.parse(JSON.stringify(roomAppointArrList));
    }
    // 获取 current 的日期，然后，将该日期与 roomAppointArr 中的日期进行对比，如果有，则使用有预约的数据，否则还是按照原来的来
    let dateItem = dateList[current];
    // 标志当前日期是否有更改
    let changed = false;
    roomAppointArr.forEach((item, index) => {
      if (item.date === dateItem.timeStamp) {
        defaultAppoint = item.appointArr;
        changed = true;
      }
    })

    console.log('changed: ', changed);


    if (changed) {
      // 处理时间段中已经预约的条目
      let currentHour = new Date().getHours();
      defaultAppoint.map(item => {
        if (item.status === '空闲' && item.time.endTime.split(":")[0] * 1 <= currentHour && current === 0) {
          console.log("不可预约");
          item['isban'] = true;
        } else {
          item['isban'] = false;
        }
        item['isAppointed'] = true;  // 标记当前日期是否是数据库中已经预约过的
        return item;
      })
      console.log('defaultAppoint: ', defaultAppoint);
      this.setData({
        defaultAppoint
      })
    } else {
      // 否则使用默认的日期安排
      this.initDefaultAppoint(current);
    }


    /*********  以下为旧代码  ********/
    /* // console.log(dateAppointedList.length);
    let currentDate = dateList[0].date.split(" ")[0];
    let currentHour = new Date().getHours();
    // 判断安排的日期的长度
    if (dateAppointedList.length === 0) {
      dateList.forEach(item => {
        item['appointArr'] = [];
        return item;
      })
    } else if (dateAppointedList.length > 0) {
      // 如果安排的日期数 < 7，将导航栏中的日期与安排的日期进行逐一匹配
      dateList.forEach((item, index) => {
        // 拆分日期
        let flag = false; // 标志位
        let date = item.date.split(' ')[0];
        for (let i = 0; i < dateAppointedList.length; i++) {
          if (dateAppointedList[i].date === date) {
            // 再判断当前日期是否有安排
            if (dateAppointedList[i].appointArr.length) {
              // 将当前日期的安排加入到 dateList 中
              if (dateAppointedList[i].date === currentDate) {
                dateAppointedList[i].appointArr.forEach(item1 => {
                  if (item1.status === '空闲' && item1.time.endTime.split(":")[0] * 1 <= currentHour) {
                    // 显示不可预约
                    console.log("不可预约");
                    item1['isban'] = true;
                    return item1;
                  }
                })
              }
              item['appointArr'] = dateAppointedList[i].appointArr;
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          console.log(date + "有安排");
        } else {
          item['appointArr'] = [];
          console.log(date + "没有安排");
        }
      })
    }
    // 将 dateList 重新传回去
    this.setData({
      dateList
    })

    // 检查当前日期的安排是否是程序自动生成的
    let {
      current
    } = this.data;
    if (dateList[current].appointArr.length === 0) {
      console.log("1");
      this.setData({
        disabled: true,
      })
    } */
    /*********  以上为旧代码  ********/
  },

  // 初始化一个获取用户openid的函数
  getOpenid() {
    wx.cloud.callFunction({
      name: 'getOpenId',
    })
      .then(res => {
        console.log(res);
        this.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid;
        // 获取openid成功以后直接判断是否是管理员
        this.isAdmin();
        // 判断是否是企业员工
        this.isEmployee();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 判断是否是管理员
  isAdmin() {
    console.log(1);
    let {
      openid
    } = this.data;
    wx.cloud.database().collection('adminInfo')
      .get()
      .then(res => {
        console.log(res);
        let adminList = res.data;
        adminList.forEach(item => {
          if (item.openid === openid) {
            this.setData({
              isAdmin: true
            })
            app.globalData.isAdmin = true;
          }
        })
      })
      .catch(err => {
        console.log(err);
      })

  },

  // 判断是否是企业员工
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

  // 查看更多点击事件
  handleLookMore() {
    let {
      currentRoomid,
      isAdmin
    } = this.data;
    console.log("跳转到教室新增页面，并携带当前教室的id");
    console.log("currentRoomid: ", currentRoomid);
    if (isAdmin) {
      console.log("当前用户是管理员");
      wx.navigateTo({
        url: '/pages/addRoom/addRoom?roomid=' + currentRoomid,
      })
    } else {
      console.log("当前用户不是管理员");
      // 跳转到教室详情展示页面给用户查看当前教室的信息
      wx.navigateTo({
        url: '/pages/showRoomInfo/showRoomInfo?roomid=' + currentRoomid,
      })
    }

  },

  // 导航栏点击事件
  changeNav(e) {
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    })
    // 该日期的预约信息也要改变
    this.handleShowAppointInfo('undefined');
  },

  // 监听swiper变换事件
  swiperChange(e) {
    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    // this.initDefaultAppoint(e.detail.current);
    this.setData({
      addNewAppoint: true,
      current: e.detail.current,
      navId: e.detail.current
    })
    // 该日期的预约信息也要改变
    this.handleShowAppointInfo('undefined');
    // let {
    //   dateList
    // } = this.data;
    // if (dateList[e.detail.current].appointArr.length === 0) {
    //   console.log("当前日期是程序自动生成的");
    //   this.setData({
    //     disabled: true,
    //   })
    // } else {
    //   this.setData({
    //     disabled: false,
    //   })
    // }
  },

  // 具体时间段点击事件
  handleAppointItem(e) {
    let {
      current,
      dateList,
      isStudent,
      isTeacher,
      isAdmin,
      first,
      currentRoomid,
    } = this.data;
    console.log(e);
    let isban = false;
    let { item } = e.currentTarget.dataset;
    isban = item.isban;
    if (isban) {
      return;
    }
    // let {defaultAppoint, dateList, current} = this.data;
    // 先看当前日期在数据库中是否有安排
    let currentStatus = item.status;
    let currentIndex = e.currentTarget.dataset.index;
    if (currentStatus === '空闲') {
      /* 
        如果当前状态是空闲，则跳转到新建预约或者管理员处理预约页面
        新建预约页面需要传递的参数：
        当前会议室的 id，当前日期的时间戳，预约开始时间和结束时间，还有一个转换后的日期，用于预约页面底部的提示
      */
      // 跳转到申请预约页面，需要填入当前的时间和日期
      let currentDate = dateList[current].date;
      let timeStamp = dateList[current].timeStamp;
      let currentStartTime = item.time.startTime;
      let currentEndTime = item.time.endTime;
      let currentDetail = item.detail;  // 查看当前是否有未处理的预约
      let isAppointed = item.isAppointed;  // 标记当前日期在数据库中是否存在预约记录
      if (isAdmin) {
        // 如果当前是管理员
        if (currentDetail.length === 0) {
          /* 
            说明没有预约待处理，跳转到预约页面
          */
          wx.navigateTo({
            url: '/pages/newAppointment/newAppointment?currentDate=' + currentDate + '&currentStartTime=' + currentStartTime + '&currentEndTime=' + currentEndTime + '&currentRoomid=' + currentRoomid + '&currentIndex=' + currentIndex + '&current=' + current + '&timeStamp=' + timeStamp + '&isAppointed=' + isAppointed,
          })
        } else {
          console.log("跳转到管理员处理预约页面");
          /* 
            有预约待处理，跳转到管理员处理预约页面
          */
          /* wx.navigateTo({
            url: '/pages/handleAppointItem/handleAppointItem?currentRoomid=' + currentRoomid + '&currentDate=' + currentDate + '&currentStartTime=' + currentStartTime + '&currentIndex=' + currentIndex + '&current=' + current + '&currentEndTime=' + currentEndTime,
          }) */
        }
      } else {
        // 否则说明不是管理员
        // 再判断是否是已认证的学生或者老师
        if (isStudent || isTeacher) {
          wx.navigateTo({
            url: '/pages/newAppointment/newAppointment?currentDate=' + currentDate + '&currentStartTime=' + currentStartTime + '&currentEndTime=' + currentEndTime + '&currentRoomid=' + currentRoomid + '&currentIndex=' + currentIndex + '&current=' + current + '&timeStamp=' + timeStamp + '&isAppointed=' + isAppointed,
          })
        } else {
          // 提示普通用户（游客）
          if (first === 1) {
            wx.showModal({
              title: '提示',
              content: '您不是本系统认证用户，无法使用预约功能',
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

          }
          return
        }

      }

    } else if (currentStatus === '上课') {
      return
    } else if (currentStatus === "已预约") {
      console.log("下弹窗展示预约信息");
      wx.setNavigationBarColor({
        backgroundColor: '#676767',
        frontColor: '#000000',
      })
      // 弹出处理预约的下弹窗
      this.setData({
        isNone: true,
        btnListTouch: true,
        btnBottom1: '-800rpx',
      })

      this.animate('.handleReservation', [{
        ease: 'linear',
        translateY: 0
      },
      {
        ease: 'linear',
        translateY: -400
      },
      ], 250)

      // 获取数据
      let appointDetail = dateList[current].appointArr[currentIndex].detail;
      this.setData({
        appointDetail
      })

    }
  },

  // 蒙板点击事件
  backgroundCoverTouch() {
    // 设置导航栏的颜色，让其与背景蒙版的颜色一致
    wx.setNavigationBarColor({
      backgroundColor: '#ffffff',
      frontColor: '#000000',
    })
    this.setData({
      isup: false,
      btnListTouch: false,
      // btnBottom1: '-600rpx',
      isNone: false,
    })

  },

  // 查看预约的确定按钮
  handleConfirm() {
    this.backgroundCoverTouch();
  },

  // 保存二维码事件
  handleGenerateQr() {
    let {
      currentRoomid
    } = this.data;
    wx.showLoading({
      title: '正在保存中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'generateQr',
      data: {
        path: 'pages/roomDetail2/roomDetail2?roomid=' + currentRoomid,
        name: currentRoomid,
      }
    })
      .then(res => {

        console.log(res.result.fileID);
        // 获取图片并保存至本地相册
        this.getQrimgurl(res.result.fileID);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取图片url
  getQrimgurl(fileID) {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID,
      }]
    })
      .then(res => {
        console.log(res);
        let Qrimgurl = res.fileList[0].tempFileURL;
        wx.downloadFile({
          url: Qrimgurl,
          success: res1 => {
            wx.hideLoading();
            console.log(res1);
            wx.saveImageToPhotosAlbum({
              filePath: res1.tempFilePath,
              success: res2 => {
                console.log(res2);
              }
            })
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("监听页面显示");
    console.log(this.data.currentRoomid);
    console.log(this.data.current);
    let first = wx.getStorageSync('firstEnterRoomDetail2');
    if (first == 1) {
      wx.setStorageSync('firstEnterRoomDetail2', 2)
      return
    }
    this.onLoad({
      'roomid': this.data.currentRoomid,
      'current': this.data.current,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function (e) {
  //   console.log(e);
  //   console.log("重新向数据库请求数据，更新页面数据");
  //   // 调用云函数获取当前教室的相关安排信息
  //   wx.showLoading({
  //     title: '数据加载中',
  //   })
  //   this.getDateAppointList();
  //   console.log(this.data.currentRoomid);
  //   this.onLoad({
  //     'roomid': this.data.currentRoomid,
  //     'current': this.data.current,
  //   });
  // },

  // 下拉刷新
  onRefresh() {
    let {
      currentRoomid
    } = this.data;
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    console.log("监听下拉刷新");
    wx.showLoading({
      title: '刷新中...',
    })
    this.onLoad({
      'roomid': currentRoomid + '',
      'current': this.data.current,
    });
    // this.getData();
  },

  onPullDownRefresh: function () {
    // 关闭导航栏刷新图标
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    //调用刷新时将执行的方法
    this.onRefresh();
    console.log("关闭下拉刷新");
  },

})