// pages/newAppointment/newAppointment.js
/* 
  页面处理预约申请流程：
    1. 获取上一个页面跳转过来时传递的数据
      - 根据当前会议室当前的日期是否在数据库中有预约记录，去更新或者添加预约信息。
        - 假如当前会议室当前日期在数据库中有预约记录，则在后续检查完用户的输入之后，更新该记录的预约信息
        - 如果当前会议室当前日期没有在数据库中有预约记录，则在后续检查完用户的输入之后，添加一条会议室的预约信息
    2. 获取用户输入，并进行合法性检查
    3. 更新/添加一条会议室的预约信息，添加一条用户预约记录；
    
*/

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TimeArr: [], // 多列选择器
    currentPage: '', // 标记从哪个页面跳转过来的
    currentRoomid: '', // 教室id
    currentDate: '', // 教室详情页传过来的日期
    currentStartTime: '', // 教室详情页传过来的开始时间
    currentEndTime: '', // 教室详情页传过来的结束时间
    chooseStartTime: '', // 选中的开始时间
    chooseEndTime: '', // 选中的结束时间
    startHour: '', // 开始时间的小时
    startMin: '', // 开始时间的分钟
    thingsText: '', // 申请事宜
    textLength: 40, // 申请事宜可输入的字符个数
    appointName: '', // 预约联系人姓名
    appointPhone: '', // 预约联系人电话
    phoneError: false,
    currentIndex: '',  // 用来索引当前用户需要预约的时间段
    current: '',
    dateAppointedList: [],
    userAppointInfo: [], // 普通用户的预约表
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
    }], // 默认的安排
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let TimeArr = [],
      hour = [],
      min = ['00', '30'];
    let startHour = options.currentStartTime.split(":")[0] * 1;
    let endHour = options.currentEndTime.split(":")[0] * 1;
    let currentIndex = options.currentIndex;
    let current = options.current;
    let currentPage = options.currentPage;
    let timeStamp = options.timeStamp * 1;
    let isAppointed = options.isAppointed;
    // 之前处理时间选择器的代码
    let i = startHour;
    while (i <= endHour) {
      if (i < 10) {
        i = '0' + i;
      } else {
        i += '';
      }
      hour.push(i);
      i = i * 1 + 1;
    }
    TimeArr.push(hour, min);
    this.setData({
      TimeArr,
      chooseStartTime: options.currentStartTime,
      chooseEndTime: options.currentEndTime,
      currentDate: options.currentDate,
      currentStartTime: options.currentStartTime,
      currentEndTime: options.currentEndTime,
      currentRoomid: options.currentRoomid,
      currentIndex,
      current,
      currentPage,
      timeStamp,
      isAppointed
    })
    wx.showToast({
      title: '数据加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    this.getDateAppointList();
  },

  // 开始时间处理
  handleStartTime(e) {
    let {
      TimeArr
    } = this.data;
    console.log(e);
    let startHour = TimeArr[0][e.detail.value[0]];
    let startMin = TimeArr[1][e.detail.value[1]];
    console.log(startHour);
    console.log(startMin);
    this.setData({
      startHour,
      startMin,
      chooseStartTime: startHour + ":" + startMin,
    })
  },

  // 结束时间处理，结束时间这部分只检测了时间的长度是否合理，没有检测时间是否冲突的问题
  handleEndTime(e) {
    console.log(e);
    let {
      TimeArr,
      startHour,
      startMin
    } = this.data;

    let endHour = TimeArr[0][e.detail.value[0]];
    let endMin = TimeArr[1][e.detail.value[1]];
    this.setData({
      endHour,
      endMin,
      chooseEndTime: endHour + ':' + endMin,
    })
    console.log(startHour);
    console.log(endHour);
    // 判断用户选择的时间的合理性
    if (endHour < startHour) {
      wx.showToast({
        title: '您选择的时间不合理',
        icon: 'none',
      })
      return
    } else {
      if (endHour === startHour) {
        if (endMin <= startMin) {
          wx.showToast({
            title: '您选择的时间不合理',
            icon: 'none',
          })
          return
        }
      }
    }
  },

  // 获取用户输入的预约联系人姓名
  getContactName(e) {
    this.setData({
      appointName: e.detail.value
    })
  },

  // 获取预约联系人的电话号码
  getContactPhone(e) {
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
          appointPhone: e.detail.value,
          phoneError: false,
        })
      }
    }
  },

  // 获取申请事宜
  textareaLostFocus(e) {
    console.log("文本域失去焦点：", e.detail.value);
    let thingsText = e.detail.value;
    this.setData({
      thingsText,
      textLength: 40 - thingsText.length
    })
  },

  // 提交按钮
  handleConfirm(e) {
    console.log(e);
    console.log('app.globalData: ', app.globalData);
    // 检查预约联系人的姓名和电话是否填写，因为后面可能要开通短信消息提醒功能
    let {
      thingsText,
      appointName,
      appointPhone,
      currentDate,
      dateAppointedList,
      currentRoomid,
      currentStartTime,
      currentEndTime,
      defaultAppoint,
      current,
      currentPage,
      phoneError,
      currentIndex,
      isAppointed,  // 标记当前数据在数据库中是否存在记录
      timeStamp,
    } = this.data;
    if (phoneError) {
      return
    }
    // 先判断是否输入姓名和电话号码
    if (appointName === '' && appointPhone === '') {
      wx.showModal({
        title: '提示',
        content: '请输入预约人的姓名和电话号码',
      })
      return
    } else if (appointName === '' && appointPhone !== '') {
      wx.showModal({
        title: '提示',
        content: '请输入预约人的姓名',
      })
      return
    } else if (appointName !== '' && appointPhone === '') {
      wx.showModal({
        title: '提示',
        content: '请输入预约人的电话',
      })
      return
    }
    let myDate = new Date();
    let applyTime = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
    console.log(applyTime);
    // 先判断当前用户的openid是否是管理员的，如果是管理员，则直接更新
    // 先判断当前日期在 dateAppointInfo 中是否有安排，没有安排就添加一个默认安排，并插上预约的信息
    // let dateExit = false;
    console.log(app.globalData.isAdmin);
    // console.log(dateAppointedList);
    defaultAppoint[currentIndex].detail.push({
      "appointName": appointName,
      "appointPhone": appointPhone,
      // 更改，时间不用选择了，直接填原来的
      "time": {
        "startTime": currentStartTime,
        "endTime": currentEndTime
      },
      "thingsText": thingsText,
      "applyTime": applyTime
    })
    if (app.globalData.isAdmin) {
      defaultAppoint[currentIndex].status = '已预约';
    } else {
      defaultAppoint[currentIndex].status = '空闲';
    }
    let p1 = null, p2 = null;
    if (isAppointed == "true") {
      p1 = wx.cloud.database().collection('roomAppointInfo')
        .where({
          roomid: currentRoomid,
          date: timeStamp,
        })
        .update({
          data: {
            appointArr: defaultAppoint,
          }
        })
    } else {
      p1 = wx.cloud.database().collection('roomAppointInfo')
        .add({
          data: {
            roomid: currentRoomid,
            date: timeStamp,
            appointArr: defaultAppoint,
          }
        })
    }
    // 填写用户是管理员的情况
    wx.showToast({
      title: '正在提交申请',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    if (app.globalData.isAdmin) {
      console.log('当前填写的人是管理员，只用更新会议室的预约信息表');

      // 更新会议室预约信息表
      p1.then(res => {
        wx.hideToast();
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        // 更新完成之后跳转回相应的页面
        if (currentPage === 'newAppointment') {
          // 跳转回教室列表页
          wx.redirectTo({
            url: '/pages/roomsEdit/roomsEdit'
          })
        } else {
          console.log("非管理员不更新");
          // 如果不是管理员
          wx.navigateBack({
            url: '/pages/roomDetail2/roomDetail2?roomid=' + currentRoomid + '&current=' + current,
          })
        }

      })
        .catch(err => {
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '申请失败，请退出重试'
          })
          console.log(err);
        })
      // this.updateRoomAppointInfo(currentRoomid, timeStamp, defaultAppoint);
      // 如果是管理员，则直接去更新数据
      // dateAppointedList.forEach(item => {
      //   console.log(item.date);
      //   if (item.date === currentDate.split(" ")[0]) {
      //     dateExit = true;
      //     item.appointArr.forEach((items, index) => {
      //       // 判断是在哪个时间段上添加的预约
      //       if (items.time.startTime === currentStartTime) {
      //         items.detail = {
      //           "appointName": appointName,
      //           "appointPhone": appointPhone,
      //           // 更改，时间不用选择了，直接填原来的
      //           "time": {
      //             "startTime": currentStartTime,
      //             "endTime": currentEndTime
      //           },
      //           "thingsText": thingsText,
      //           "applyTime": applyTime
      //         }
      //         items.time.startTime = currentStartTime;
      //         items.time.endTime = currentEndTime;
      //         items.status = '已预约';
      //       }
      //     })
      //     return item;
      //   }

      // })
      // 如果当前日期在 dateAppointInfo 中无安排，则先在默认的安排中添加，然后再添加到 dateAppointInfo 中
      // if (!dateExit) {
      //   console.log("当前日期无安排");
      //   defaultAppoint.forEach((item, index) => {
      //     console.log(item);
      //     if (item.time.startTime === currentStartTime) {
      //       item.detail = {
      //         "appointName": appointName,
      //         "appointPhone": appointPhone,
      //         "time": {
      //           "startTime": currentStartTime,
      //           "endTime": currentEndTime
      //         },
      //         "thingsText": thingsText,
      //         "applyTime": applyTime
      //       }
      //       item.time.startTime = currentStartTime;
      //       item.time.endTime = currentEndTime;
      //       item.status = '已预约';
      //       return item;
      //     }
      //   })

      //   // 这是没有安排的日期，要么在后面加，要么就按时间大小来加
      //   // 先直接加吧
      //   dateAppointedList.push({
      //     "date": currentDate.split(" ")[0],
      //     "appointArr": defaultAppoint,
      //   })
      //   console.log(dateAppointedList);
      // }
    } else {
      // 如果是普通用户，则提交到 dateAppointedList 中，
      console.log('当前填写的人不是管理员，需要更新两个表');
      console.log(app.globalData.openid);
      // 先判断会议室预约信息表的数据是要添加还是更新

      let p2 = wx.cloud.database().collection('userAppointInfo')
        .add({
          data: {
            "openid": app.globalData.openid,
            "roomid": currentRoomid,
            "appointName": appointName,
            "appointPhone": appointPhone,
            "time": {
              "date": currentDate,
              "startTime": currentStartTime,
              "endTime": currentEndTime
            },
            "thingsText": thingsText,
            "applyTime": applyTime,
            "isAgree": 0, // 审核标志，0-待审核，1-通过，2-不通过
          }
        })

      console.log('p1: ', p1);
      Promise.all([p1, p2]).then(res => {
        console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        // 更新完成之后跳转回相应的页面
        if (currentPage === 'newAppointment') {
          // 跳转回教室列表页
          wx.redirectTo({
            url: '/pages/roomsEdit/roomsEdit'
          })
        } else {
          console.log("非管理员不更新");
          // 如果不是管理员
          wx.navigateBack({
            url: '/pages/roomDetail2/roomDetail2?roomid=' + currentRoomid + '&current=' + current,
          })
        }

      })

        .catch(err => {
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '申请失败，请退出重试'
          })
          console.log(err);
        })


      // let appointArr1 = '';
      // dateAppointedList.forEach(item => {
      //   console.log(item.date);
      //   if (item.date === currentDate.split(" ")[0]) {
      //     dateExit = true;
      //     item.appointArr.forEach((items, index) => {
      //       // 判断是在哪个时间段上添加的预约
      //       if (items.time.startTime === currentStartTime) {
      //         items.detail.push({
      //           "appointName": appointName,
      //           "appointPhone": appointPhone,
      //           "time": {
      //             "startTime": currentStartTime,
      //             "endTime": currentEndTime
      //           },
      //           "thingsText": thingsText,
      //           "applyTime": applyTime,
      //           "isAgree": 0, // 审核标志，0-待审核，1-通过，2-不通过
      //           "openid": app.globalData.openid, // 保存普通用户的openid，用于后续管理员审核用户申请条目时，更新其条目
      //         })
      //         items.time.startTime = currentStartTime;
      //         items.time.endTime = currentEndTime;
      //         // 以下是普通用户的预约表
      //         appointArr1 = {
      //           "roomid": currentRoomid,
      //           "appointName": appointName,
      //           "appointPhone": appointPhone,
      //           "time": {
      //             "date": currentDate,
      //             "startTime": currentStartTime,
      //             "endTime": currentEndTime
      //           },
      //           "thingsText": thingsText,
      //           "applyTime": applyTime,
      //           "isAgree": 0, // 审核标志，0-待审核，1-通过，2-不通过
      //         };
      //       }
      //     })
      //     return item;
      //   }

      // })
      // // 如果当前日期在 dateAppointInfo 中无安排，则先在默认的安排中添加，然后再添加到 dateAppointInfo 中
      // if (!dateExit) {
      //   console.log("当前日期无安排");
      //   defaultAppoint.forEach((item, index) => {
      //     console.log(item);
      //     if (item.time.startTime === currentStartTime) {
      //       item.detail.push({
      //         "appointName": appointName,
      //         "appointPhone": appointPhone,
      //         "time": {
      //           "startTime": currentStartTime,
      //           "endTime": currentEndTime
      //         },
      //         "thingsText": thingsText,
      //         "applyTime": applyTime,
      //         "isAgree": 0, // 审核标志，0-待审核，1-通过，2-不通过
      //         "openid": app.globalData.openid,
      //       })
      //       item.time.startTime = currentStartTime;
      //       item.time.endTime = currentEndTime;
      //       // 以下是普通用户的预约表
      //       appointArr1 = {
      //         "roomid": currentRoomid,
      //         "appointName": appointName,
      //         "appointPhone": appointPhone,
      //         "time": {
      //           "date": currentDate,
      //           "startTime": currentStartTime,
      //           "endTime": currentEndTime
      //         },
      //         "thingsText": thingsText,
      //         "applyTime": applyTime,
      //         "isAgree": 0, // 审核标志，0-待审核，1-通过，2-不通过
      //       };
      //       return item;
      //     }
      //   })

      //   // 这是没有安排的日期，要么在后面加，要么就按时间大小来加
      //   // 先直接加吧
      //   dateAppointedList.push({
      //     "date": currentDate.split(" ")[0],
      //     "appointArr": defaultAppoint,
      //   })
      //   console.log(dateAppointedList);
      // }
      // console.log(dateAppointedList);

      // // 将普通用户的预约信息添加到他的预约表中
      // let openid = app.globalData.openid;
      // this.getUserAppointInfo(openid, appointArr1);
    }
    // 更新数据库
    // wx.showLoading({
    //   title: '上传中',
    // })
    // this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
    // // 跳转回教室详情页
    // // 将当前教室的roomid传回去
    // if (!app.globalData.isAdmin) {
    //   // 如果是从条件查询页面跳转过来的，则返回教室列表页
    //   if (currentPage === 'newAppointment') {
    //     // 跳转回教室列表页
    //     wx.redirectTo({
    //       url: '/pages/roomsEdit/roomsEdit'
    //     })
    //   } else {
    //     console.log("非管理员不更新");
    //     // 如果不是管理员
    //     wx.navigateBack({
    //       url: '/pages/roomDetail2/roomDetail2?roomid=' + currentRoomid + '&current=' + current,
    //     })
    //   }
    //   wx.showToast({
    //     title: '提交成功',
    //     icon: 'success'
    //   })
    // }

  },

  // 获取用户的预约表
  getUserAppointInfo(openid, appointArr1) {
    wx.cloud.database().collection('userAppointInfo')
      .get()
      .then(res => {
        console.log(res.data);
        let userAppointInfo = '';
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].openid === openid) {
            userAppointInfo = res.data[i].appointArr;
            userAppointInfo.push(appointArr1)
            break;
          }
        }
        this.updateUserAppointInfo(openid, userAppointInfo);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 更新用户的预约表
  updateUserAppointInfo(openid, userAppointInfo) {
    let appointArr = userAppointInfo;
    console.log(appointArr);
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

  // roomAppointInfo 数据表更新操作
  updateRoomAppointInfo(roomid, dateAppointInfo) {
    let {
      current,
      currentPage
    } = this.data;
    wx.cloud.callFunction({
      name: 'updateRoomAppointInfo',
      data: {
        roomid,
        dateAppointInfo
      }
    })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        if (app.globalData.isAdmin) {
          if (currentPage === 'newAppointment') {
            // 跳转回教室列表页
            wx.redirectTo({
              url: '/pages/roomsEdit/roomsEdit'
            })
          } else {
            console.log("管理员更新");
            // 如果不是管理员
            wx.navigateBack({
              url: '/pages/roomDetail2/roomDetail2?roomid=' + roomid + '&current=' + current,
            })
          }
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 调用云函数获取当前教室的相关预约信息
  /* 
    根据会议室 id 和 date 时间戳去获取该日期的预约信息
  */
  getDateAppointList() {
    let {
      currentRoomid,
      isAppointed,
      timeStamp,
    } = this.data;

    wx.cloud.database().collection('roomAppointInfo')
      .where({
        roomid: currentRoomid,
        date: timeStamp,
      })
      .get()
      .then(res => {
        wx.hideToast();
        if (res.data.length !== 0) {
          // 说明有记录
          this.setData({
            defaultAppoint: res.data[0].appointArr,
          })
        }
      })
      .catch(err => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '数据获取失败，请退出重试',
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
    //     console.log(res.result.data[0].dateAppointInfo);
    //     let dateAppointedList = res.result.data[0].dateAppointInfo;
    //     // 对 dateAppointedList 进行排序
    //     dateAppointedList = this.dateSort(dateAppointedList);
    //     this.setData({
    //       dateAppointedList
    //     })
    //     // this.handleShowAppointInfo();
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
    console.log("监听页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("监听页面卸载");
    // 
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