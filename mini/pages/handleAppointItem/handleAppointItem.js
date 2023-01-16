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
    appointArr: [],  // 更新会议室预约信息时用
    detail: [],
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
      timeStamp: options.timeStamp * 1,
    })

    /* 
      处理逻辑：
      先根据 roomid 跟时间戳以及当前时间段去获取该会议室当前日期当前时间段的安排
    */
    this.getAppointInfo(options.currentRoomid, options.timeStamp, options.currentIndex, []);
    // this.getDateAppointList();
    // 获取用户的预约表
    // this.getUserAppointInfo();
  },

  // 获取当前会议室当前日期当前时间段的安排
  getAppointInfo(currentRoomid, timeStamp, currentIndex, detail) {
    wx.showToast({
      title: '数据加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    wx.cloud.database().collection('roomAppointInfo')
      .where({
        roomid: currentRoomid,
        date: timeStamp * 1,
      })
      .get()
      .then(res => {
        wx.hideToast();
        console.log(res);
        const appointArr = res.data[0].appointArr;
        detail = appointArr[currentIndex].detail.reverse();
        // detail = appointArr[currentIndex].detail;
        // detail = detail.map(item => {
        //   // item['isban'] = false;
        //   return item;
        // })
        // 处理预约信息中用户的预约申请缘由
        detail = detail.map(item => {
          item.showMore = true;
          return item;
        })
        console.log(detail);
        this.setData({
          appointArr,
          detail,
        })
      })
      .catch(err => {
        console.log(err);
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '数据获取失败，请退出重试',
        })
      })

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
      管理员点击不同意之后，更新用户的预约表和会议室的预约表，
      然后重新获取数据，重新渲染页面
     */
    let {
      detail,
      currentIndex,
      appointArr,
    } = this.data;

    let { index, item } = e.currentTarget.dataset;
    if (item.isban) {
      return
    }
    // 先存储其他预约申请的关键信息
    let otherAppointInfo = [];
    otherAppointInfo.push(JSON.parse(JSON.stringify(detail[index])));
    otherAppointInfo[0].choosed = false;
    detail[index].isban = true;
    console.log(otherAppointInfo);
    // detail = JSON.parse(JSON.stringify(detail[index]));
    appointArr[currentIndex].detail = detail.reverse();
    // 开始更新
    let rejectReason = '';
    this.updateAppointInfo(appointArr, otherAppointInfo, 1, rejectReason);
  },

  // 同意按钮处理事件
  handleAgree(e) {
    let {
      currentIndex,
      appointArr,
    } = this.data;
    console.log(e);
    let { index, item } = e.currentTarget.dataset;
    // wx.showLoading({
    //   title: '数据上传中',
    // })
    /**
     * 点击当前条目的同意按钮之后，其他条目的同意按钮将被禁用，
     * 并且数据库中自动修改其他条目的申请状态，即不通过
     * 并将当前同意的预约设置成已经预约，然后删掉其他不同意的预约
     */
    let {
      detail
    } = this.data;
    // 先判断当前的同意按钮是否被禁用，如果被禁用，则直接返回
    if (item.isban) {
      return
    }
    if (detail.length === 1) {
      // 直接处理，不需要提示说明
      // 确定同意当前的预预约申请
      // 先存储其他预约申请的关键信息
      let otherAppointInfo = JSON.parse(JSON.stringify(detail));
      // 用一个字段去标识当前项是预约通过的
      otherAppointInfo = otherAppointInfo.map((itm, idx) => {
        if (index === idx) {
          itm.choosed = true;
        } else {
          itm.choosed = false;
        }
        return itm;
      });
      detail = JSON.parse(JSON.stringify(detail[index]));
      appointArr[currentIndex].detail = detail;
      appointArr[currentIndex].status = '已预约';
      // 更新用户预约信息和会议室预约信息
      let rejectReason = '其他预约申请的优先级更高';
      this.updateAppointInfo(appointArr, otherAppointInfo, 2, rejectReason);
    } else {
      wx.showModal({
        title: '提示',
        content: '点击同意后，其他同一时间段的预约申请将会被设置为不同意',
        success: res => {
          if (res.confirm) {
            // 确定同意当前的预预约申请
            // 先存储其他预约申请的关键信息
            let otherAppointInfo = JSON.parse(JSON.stringify(detail));
            // 用一个字段去标识当前项是预约通过的
            otherAppointInfo = otherAppointInfo.map((itm, idx) => {
              if (index === idx) {
                itm.choosed = true;
              } else {
                itm.choosed = false;
              }
              return itm;
            });
            detail = JSON.parse(JSON.stringify(detail[index]));
            appointArr[currentIndex].detail = detail;
            appointArr[currentIndex].status = '已预约';
            // 更新用户预约信息和会议室预约信息
            let rejectReason = '其他预约申请的优先级更高';
            this.updateAppointInfo(appointArr, otherAppointInfo, 2, rejectReason);
          }
          if (res.cancel) {
            return;
          }
        }
      })
    }
  },

  // 更新 roomAppointInfo 和 userAppointInfo 
  updateAppointInfo(appointArr, otherAppointInfo, page, rejectReason) {
    let {
      currentRoomid,
      timeStamp,
      current,
      currentIndex,
      detail
    } = this.data;
    wx.showToast({
      title: '数据更新中',
      icon: 'loading',
      mask: true,
      duration: 3000,
    })
    // 创建 promise 数组
    const p_arr = [];
    console.log("appointArr: ", appointArr);
    let p1 = wx.cloud.database().collection('roomAppointInfo')
      .where({
        roomid: currentRoomid,
        date: timeStamp * 1,
      })
      .update({
        data: {
          appointArr,
        }
      })
    p_arr.push(p1);
    otherAppointInfo.forEach(item => {
      console.log('item: ', item);
      // 先判断当前预约是否已经被处理过，即看 isban 字段
      // 如果被处理过，则不处理了
      // if (item.choosed) {
      //   // 说明当前的申请是给予通过的
      // }
      if (!item.isban) {
        let p = null;
        if (item.choosed) {
          p = wx.cloud.database().collection('userAppointInfo')
            .where({
              openid: item.openid,
              createTime: item.createTime,
            })
            .update({
              data: {
                isAgree: 1,
                handleTime: new Date().getTime(),
              }
            });
        } else {
          p = wx.cloud.database().collection('userAppointInfo')
            .where({
              openid: item.openid,
              createTime: item.createTime,
            })
            .update({
              data: {
                isAgree: -1,
                handleTime: new Date().getTime(),  // 管理员处理时间
                rejectReason,
              }
            });
        }
        p_arr.push(p);
      }

    })
    console.log('p_arr: ', p_arr);
    // 发请求
    Promise.all(p_arr).then(res => {
      console.log(res);
      wx.hideToast();
      wx.showToast({
        title: '数据更新成功',
        icon: 'success',
        duration: 500,
      });
      setTimeout(() => {
        if (page === 2) {
          wx.navigateBack({
            url: '/pages/roomDetail2/roomDetail2?roomid=' + currentRoomid + '&current=' + current,
          })
        } else {
          // 重新加载页面
          this.getAppointInfo(currentRoomid, timeStamp, currentIndex, detail);
        }

      }, 500);

    })
      .catch(err => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '数据更新失败，请重新尝试',
        })
        console.log(err);
      })
  },

  // 点击查看更多按钮
  handleShowMore(e) {
    let { detail } = this.data;
    // 获取当前索引
    let { index } = e.currentTarget.dataset;
    // 动态修改 css 样式
    // if (!detail[index].showMore) {
    // }
    detail[index].showMore = !detail[index].showMore;
    console.log("用户点击了查看更多按钮")
    this.setData({
      detail,
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
