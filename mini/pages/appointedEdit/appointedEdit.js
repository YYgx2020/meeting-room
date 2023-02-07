// pages/appointedEdit/appointedEdit.js

/* 
  页面逻辑：
  根据日期时间戳获取该日期下的所有教室的预约情况，并在那个日期的页面中展示和处理
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], // 周表
    dateList: [], // 日期列表
    everydayAppoint: new Array(7).fill({ hasLoaded: false, data: [] }), // 每天的安排
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
    this.getRoomAppointInfo(0);
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
      let tempDate = ((myDate.getMonth() + 1) + '/' + myDate.getDate() + ' ' + currentWeekday);
      let time = new Date(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()).getTime();
      dateList.push({
        id: i,
        date: tempDate,
        time,
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
  getRoomAppointInfo(index) {
    // 根据时间戳去获取当前日期下各个教室的预约信息
    let {
      dateList,
      everydayAppoint
    } = this.data;
    if (everydayAppoint[index].hasLoaded) return;
    let currentDate = dateList[index];
    wx.showToast({
      title: '数据载入中',
      icon: 'loading',
      mask: true,
      duration: 3000,
    });
    wx.cloud.database().collection('roomAppointInfo')
      .where({
        date: currentDate.time,
      })
      .get()
      .then(res => {
        wx.hideToast();
        console.log(res);
        // 处理数据
        let data = [];
        for (let item of res.data) {
          let appointArr = item.appointArr;
          for (let i = 0; i < appointArr.length; i++) {
            if (appointArr[i].status === '空闲' && appointArr[i].detail.length !== 0) {
              // data.push()
              // console.log(_item.detail);
              const detail = appointArr[i].detail;
              for (let j = 0; j < detail.length; j++) {
                detail[j].roomid = item.roomid;
                detail[j].firstIndex = i;
                detail[j].secondIndex = j;
                detail[j].showMore = true;
                data.push(JSON.parse(JSON.stringify(detail[j])));
              }
            }
          }
        }
        everydayAppoint[index].hasLoaded = true;
        everydayAppoint[index].data = data;
        this.setData({
          everydayAppoint,
        })
      })
      .catch(err => {
        wx.hideToast();
        console.log(err);
      })
  },

  // 导航栏点击事件
  changeNav(e) {
    console.log(e);
    let navId = e.currentTarget.id;
    this.getRoomAppointInfo(navId * 1);
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    })
  },

  swiperChange(e) {
    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    this.getRoomAppointInfo(e.detail.current);
    this.setData({
      current: e.detail.current,
      navId: e.detail.current
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
      everydayAppoint,
      current,
      dateList
    } = this.data;

    let { index, item } = e.currentTarget.dataset;
    // 如果 isban === true，就说明已经处理过了
    if (item.isban) {
      return
    }
    console.log(everydayAppoint[current].data[index]);
    // 发请求去获取会议室信息
    wx.cloud.database().collection('roomAppointInfo')
      .where({
        roomid: item.roomid,
        date: dateList[current].time
      })
      .get()
      .then(res => {
        console.log(res);
        const otherAppointInfo = [];
        otherAppointInfo.push(JSON.parse(JSON.stringify(item)));
        otherAppointInfo[0].choosed = false;
        const appointArr = res.data[0].appointArr;
        item.isban = true;
        appointArr[item.firstIndex].detail[item.secondIndex] = JSON.parse(JSON.stringify(item));
        this.updateAppointInfo(appointArr, otherAppointInfo, '', item.roomid);
      })
      .catch(err => {
        console.log(err);
        wx.showToast({
          title: '出错了',
          icon: 'error',
        })
      })
  },

  // 同意按钮处理事件
  handleAgree(e) {
    let {
      current,
      everydayAppoint,
      dateList,
    } = this.data;
    console.log(e);
    let { index, item } = e.currentTarget.dataset;
    if (item.isban) {
      return
    }
    console.log(everydayAppoint[current].data[index]);
    wx.cloud.database().collection('roomAppointInfo')
      .where({
        roomid: item.roomid,
        date: dateList[current].time
      })
      .get()
      .then(res => {
        // 先取出 detail
        let appointArr = res.data[0].appointArr;
        let detail = appointArr[item.firstIndex].detail;
        let otherAppointInfo = JSON.parse(JSON.stringify(detail));
        console.log(otherAppointInfo);
        otherAppointInfo = otherAppointInfo.map((itm, idx) => {
          if (item.secondIndex === idx) {
            itm.choosed = true;
          } else {
            itm.choosed = false;
          }
          return itm;
        });
        detail = JSON.parse(JSON.stringify(detail[index]));
        appointArr[item.firstIndex].detail = detail;
        appointArr[item.firstIndex].status = '已预约';
        // 更新用户预约信息和会议室预约信息
        let rejectReason = '其他预约申请的优先级更高';
        this.updateAppointInfo(appointArr, otherAppointInfo, rejectReason, item.roomid);
      })
      .catch(err => {
        console.log(err);
        wx.showToast({
          title: '出错了',
          icon: 'error',
        });
      })
  },

  // 更新 roomAppointInfo 和 userAppointInfo 
  updateAppointInfo(appointArr, otherAppointInfo, rejectReason, roomid) {
    let {
      dateList,
      current,
      everydayAppoint,
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
        roomid,
        date: dateList[current].time,
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
        let p_message = null;
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
          // p_message = wx.cloud.callFunction({
          //   name: "sendSms",    //这个名字要跟上传并部署的那个文件名一样
          //   data: {
          //     name: item.phone,
          //   }
          // })
        }
        p_arr.push(p);
        // p_arr.push(p_message);
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
      // 重新获取数据
      everydayAppoint[current].hasLoaded = false;
      this.setData({
        everydayAppoint,
      })
      // 发短信通过用户
      this.getRoomAppointInfo(current);

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
    let { everydayAppoint, current } = this.data;
    // 获取当前索引
    let { index } = e.currentTarget.dataset;
    everydayAppoint[current].data[index].showMore = !everydayAppoint[current].data[index].showMore;
    console.log("用户点击了查看更多按钮")
    this.setData({
      everydayAppoint,
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