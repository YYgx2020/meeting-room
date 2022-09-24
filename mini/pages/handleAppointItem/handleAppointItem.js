// pages/handleAppointItem/handleAppointItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentRoomid: '',
    currentStartTime: '',
    currentEndTime: '',
    currentIndex: '',
    currentDate: '',
    current: '',
    month: '',
    day: '',
    dateAppointedList: [],
    userAppointInfo: '',
    detail: [], // 预约条目
    index: '', // 点击条目的索引，如果有多个
    detailAppointed: {},
    showMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      current: options.current,
      currentRoomid: options.currentRoomid,
      currentDate: options.currentDate.split(" ")[0],
      currentIndex: options.currentIndex,
      currentStartTime: options.currentStartTime,
      currentEndTime: options.currentEndTime,
      month: options.currentDate.split(" ")[0].split("/")[0],
      day: options.currentDate.split(" ")[0].split("/")[1],
    })
    this.getDateAppointList();
    // 获取用户的预约表
    this.getUserAppointInfo();
  },

  // 获取用户的预约表
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

  // 获取预约表
  // 调用云函数获取当前教室的相关预约信息
  getDateAppointList() {
    let {
      currentRoomid
    } = this.data;
    wx.cloud.callFunction({
        name: 'getDateAppointList',
        data: {
          roomid: currentRoomid
        }
      })
      .then(res => {
        console.log(res.result.data[0].dateAppointInfo);
        let dateAppointedList = res.result.data[0].dateAppointInfo;
        this.setData({
          dateAppointedList
        })
        this.getDetail(dateAppointedList);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取具体的预约信息
  getDetail(dateAppointedList) {
    console.log(dateAppointedList);
    let {
      currentDate,
      currentIndex
    } = this.data;
    console.log(currentIndex);
    dateAppointedList.forEach(item => {
      console.log(item);
      if (item.date === currentDate) {
        console.log(1);
        currentIndex = currentIndex * 1;
        // console.log(item.appoinntArr[currentIndex * 1].detail);
        let detail = item.appointArr[currentIndex * 1].detail;
        // 给detail中的每一项添加一个 是否禁用的标志
        detail.forEach(item => {
          item['isban'] = false;
          return item;
        })
        detail.reverse();
        this.setData({
          detail
        })
      }
    })
  },

  // 不同意按钮处理事件
  handleDisagree(e) {
    console.log(e);
    /**
     * 点击不同意之后，将会删除当前条目，并告知用户的申请状态为不通过，那就要修改数据库，要获取用户的openid
     */
    let {
      detail,
      dateAppointedList,
      userAppointInfo,
      currentRoomid,
      currentIndex,
      currentStartTime,
      currentDate,
    } = this.data;
    detail.forEach((item1, index1) => {
      if (index1 === e.currentTarget.dataset.index) {
        // 获取申请人的预约表，修改其状态
        for (let i = 0; i < userAppointInfo.length; i++) {
          if (userAppointInfo[i].openid === item1.openid) {
            // 修改状态为不通过 - 1
            userAppointInfo[i].appointArr.forEach(item2 => {
              if (item2.applyTime === e.currentTarget.dataset.item.applyTime) {
                console.log(item2.applyTime);
                console.log(e.currentTarget.dataset.item.applyTime);
                item2.isAgree = 1;
                return item2;
              }
            })
            // 更新用户的预约表
            this.updateUserAppointInfo(item1.openid, userAppointInfo[i].appointArr);
            break
          }
        }

        // 更新 dateAppointedList
        console.log(dateAppointedList);
        console.log(item1);
        // console.log(current);
        dateAppointedList.forEach(item3 => {
          console.log(item3);
          if (item3.date === currentDate) {
            if (currentStartTime === item3.appointArr[currentIndex].time.startTime) {
              // 修改状态为空闲
              item3.appointArr[currentIndex].detail = [];
              item3.appointArr[currentIndex].status = '空闲';
              return item3;
            }
          }
        })
        console.log(dateAppointedList);
      }
    })

    // 将数据重新传回data中
    this.setData({
      detail,
      dateAppointedList,
      userAppointInfo
    })
    if (detail.length === 1) {
      // 上传 dateAppointedList 数据
      this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
    }
  },

  // 同意按钮处理事件
  handleAgree(e) {
    let {
      currentRoomid,
      currentIndex,
      current,
      userAppointInfo,
      currentStartTime,
      currentDate,
      dateAppointedList,
    } = this.data;
    console.log(e);
    wx.showLoading({
      title: '数据上传中',
    })
    /**
     * 点击当前条目的同意按钮之后，其他条目的同意按钮将被禁用，
     * 并且数据库中自动修改其他条目的申请状态，即不通过
     * 并将当前同意的预约设置成已经预约，然后删掉其他不同意的预约
     */
    let {
      detail
    } = this.data;
    // 先判断当前的同意按钮是否被禁用，如果被禁用，则直接返回
    if (e.currentTarget.dataset.item.isban) {
      return
    }
    let detailAppointed = {};
    detail.forEach((item, index) => {
      console.log(index);
      console.log(e.currentTarget.dataset.index);
      if (index === e.currentTarget.dataset.index) {
        // 获取申请人的预约表，修改其状态
        for (let i = 0; i < userAppointInfo.length; i++) {
          if (userAppointInfo[i].openid === item.openid) {
            // 修改状态为通过
            userAppointInfo[i].appointArr.forEach(items => {
              // if (items.roomid === currentRoomid) {
              //   if (items.time.date.split(" ")[0] === currentDate) {
              //     // 如果 openid，roomid，日期都匹配上了，那就修改审核状态
              //     items.isAgree = 2;
              //   }
              // }
              console.log(items.applyTime);
              console.log(e.currentTarget.dataset.item.applyTime);
              if (items.applyTime === e.currentTarget.dataset.item.applyTime) {
                console.log(items.applyTime);
                console.log(e.currentTarget.dataset.item.applyTime);
                items.isAgree = 2;
                return items;
              }
            })
            console.log(userAppointInfo[i].appointArr);
            // 更新用户的预约表
            this.updateUserAppointInfo(item.openid, userAppointInfo[i].appointArr);
          }
        }
        item.isban = true;
        // 更新 dateAppointedList
        console.log(dateAppointedList);
        console.log(item);
        // console.log(current);
        dateAppointedList.forEach(_item => {
          console.log(_item);
          if (_item.date === currentDate) {
            if (currentStartTime === _item.appointArr[currentIndex].time.startTime) {
              _item.appointArr[currentIndex].detail = item;
              _item.appointArr[currentIndex].status = '已预约';
              return _item;
            }
          }
        })
        console.log(dateAppointedList);
        return item
      } else {
        // 获取申请人的预约表，修改其状态
        for (let i = 0; i < userAppointInfo.length; i++) {
          if (userAppointInfo[i].openid === item.openid) {
            // 修改状态为不通过
            userAppointInfo[i].appointArr.forEach(items => {
              if (items.applyTime !== e.currentTarget.dataset.item.applyTime) {
                console.log(items.applyTime);
                console.log(e.currentTarget.dataset.item.applyTime);
                items.isAgree = 1;
                return items;
              }
            })
            console.log(userAppointInfo[i].appointArr);
            // 更新用户的预约表
            this.updateUserAppointInfo(item.openid, userAppointInfo[i].appointArr);
          }
        }
        // detailAppointed = item;
        // 更新 dateAppointedList
        console.log(dateAppointedList);
        console.log(item);
        // console.log(current);
        dateAppointedList.forEach(_item => {
          console.log(_item);
          if (_item.date === currentDate) {
            if (currentStartTime === _item.appointArr[currentIndex].time.startTime) {
              _item.appointArr[currentIndex].detail = item;
              _item.appointArr[currentIndex].status = '已预约';
              return _item;
            }
          }
        })
        console.log(dateAppointedList);
      }
    })
    console.log(userAppointInfo);
    // 将不同意的申请隐藏
    // 重新将 detail 写回data中
    this.setData({
      detail,
      dateAppointedList,
      userAppointInfo
    })
    this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
    // 同意之后直接跳回教室详情页

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
        // wx.hideLoading();
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // roomAppointInfo 数据表更新操作
  updateRoomAppointInfo(roomid, dateAppointInfo) {
    let {
      current
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
        // 应该等数据更新成功后再跳转
        // 将当前教室的roomid传回去
        wx.navigateBack({
          url: '/pages/roomDetail2/roomDetail2?roomid=' + roomid + '&current=' + current,
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 点击查看更多按钮
  handleShowMore() {
    let {showMore} = this.data;
    console.log("用户点击了查看更多按钮")
    this.setData({
      showMore: !showMore,
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
    console.log("监听页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("监听页面卸载");
    let {
      currentRoomid,
      dateAppointedList
    } = this.data;
    // 页面卸载之后更新数据

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
