// pages/roomsEdit/roomsEdit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '9/19 周六', // 当前日期
    currentHour: '', // 当前时间
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], // 周表
    triggered: false,
    isAdmin: '', // 判断是否是管理员
    roomInfo: [],
    // 设置开始的位置
    startX: 0,
    startY: 0,
    isShowSearch: false, // 是否展示搜索框
    searchContent: '', // 搜索内容
    isShowClearIcon: false, // 是否展示清除图标
    startTime: 0, // 开始时间
    isRefresher: true,
    roomAppointInfo: [], // 教室预约表 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 关闭导航栏的刷新图标
    wx.hideNavigationBarLoading();
    this.getCurrentDate();
    this.getRoomAppointInfo();
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      showTip1: false,
      isRefresher: true,
      isAdmin: app.globalData.isAdmin,
    })
    // 请求数据库获取roomInfo
    this.getRoomInfo();
  },

  // 请求数据库获取roomInfo
  getRoomInfo() {
    wx.cloud.callFunction({
        name: 'getRoomInfo',
      })
      .then(res => {
        console.log(res);
        this.setData({
          triggered: false, // 关闭下拉刷新
          showTip1: true,
          roomInfo: res.result.data
        })
        wx.hideLoading({
          success: (res) => {
            console.log(res);
          },
        })
        this.ininRoomInfo();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取当前日期
  getCurrentDate() {
    const {
      weekday
    } = this.data;
    const myDate = new Date(); // 获取今天的日期
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    weekday.forEach((item, index) => {
      if (index === myDate.getDay()) {
        let week_day = item;
        console.log(week_day);
        this.setData({
          currentDate: month + '/' + day + ' ' + week_day,
        })
      }
    })
    // 获取当前时间
    let currentHour = myDate.getHours();
    let currentMin = myDate.getMinutes();
    this.setData({
      currentHour,
      currentMin
    })
    // console.log(currentDate);
  },

  // 获取教室预约表
  // 调用云函数获取当前教室的相关预约信息
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

  // 初始化roomInfo
  ininRoomInfo() {
    // 给roomInfo中的每一项添加 isTouchMove 和 isShow 属性
    let {
      roomInfo,
      roomAppointInfo,
      currentDate,
      currentHour,
    } = this.data;
    roomInfo.forEach(item => {
      // 按日期查询当前教室当前时间段的状态
      if (currentHour * 1 >= 8 && currentHour * 1 <= 21) {
        console.log(currentHour);
        for (let i = 0; i < roomAppointInfo.length; i++) {
          if (roomAppointInfo[i].roomid == item.roomid) {
            let hasDay = false;
            if (roomAppointInfo[i].dateAppointInfo.length === 0) {
              // 说明没有安排
              console.log(roomAppointInfo[i].dateAppointInfo.length);
              item['currentStatus'] = '空闲';
            } else {
              roomAppointInfo[i].dateAppointInfo.forEach((_item, _index) => {
                console.log(_item.date);
                console.log(currentDate.split(" ")[0]);
                if (_item.date === currentDate.split(" ")[0]) {
                  console.log(1);
                  hasDay = true;
                  _item.appointArr.forEach((item1, index1) => {
                    let startHour = item1.time.startTime.split(':')[0] * 1;
                    if (startHour === currentHour || currentHour * 1 - startHour === 1) {
                      item['currentStatus'] = item1.status;
                      return item;
                    }
                  })
                }
              })
            }
            if (!hasDay) {
              // 当前教室的当前日期没有安排，设置为空闲
              item['currentStatus'] = '空闲';
            }
          }
        }
      } else {
        console.log(1);
        item['currentStatus'] = '无';
      }
      // 获取图片 url
      // item['roomCoverImg'] = item.roomCoverImg;
      item['isTouchMove'] = false; // 默认不滑动
      item['isShow'] = true; // 默认展示
    })
    // console.log(roomInfo);
    roomInfo.reverse();
    console.log("页面更新了");
    this.setData({
      roomInfo
    })
  },

  // 搜索按钮点击事件
  handleSearch() {
    console.log("用户点击了搜索");
    this.setData({
      isShowSearch: true,
      triggered: false,
      isRefresher: false,
    })
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },

  //  输入框事件
  handleInputChange(event) {
    console.log("看看用户有没有输入", event.detail);
    // 获取输入框的值
    const {
      value
    } = event.detail;
    this.setData({
      isShowClearIcon: true,
    })
    // 防抖
    clearTimeout(this.TimeID);
    // 在发送请求之前添加一个定时器，延时1秒钟执行。
    this.TimeID = setTimeout(() => {
      if (value.trim() === '') {
        // 如果用户没有输入搜索词，就清空 searchContent
        console.log('用户没有输入内容');
        this.setData({
          isShowClearIcon: false,
          searchContent: '',
        })
      } else {
        console.log(value.trim());
        // 将用户输入的值传入 searchContent
        this.setData({
          searchContent: value.trim()
        })
      }
      this.setRoomShowToTrue();
      this.ShowSearchResult();
    }, 300);
  },

  // 输入框清理图标
  clearSearchContent() {
    console.log("用户点击了清理");
    this.setData({
      searchContent: '',
      isShowClearIcon: false,
    })
    // 点击取消之后要将所有教室的展示状态设置回 true
    this.setRoomShowToTrue();
    this.setData({
      showTip: false,
    })
  },

  // 将教室列表中每一项的展示状态设置为 true
  setRoomShowToTrue() {
    let {
      roomInfo
    } = this.data;
    roomInfo.forEach(item => {
      item.isShow = true;
    })
    this.setData({
      roomInfo
    })
  },

  // 取消按钮点击事件
  handleCancel() {
    this.setData({
      searchContent: '',
      isShowClearIcon: false,
      isShowSearch: false,
      showTip: false,
      triggered: true,
      isRefresher: true,
    })
    // 点击取消之后要将所有教室的展示状态设置回 true
    this.setRoomShowToTrue();
  },

  // 条件搜索跳转链接
  handleConditionSearch() {
    // 跳转至新的页面让用户进行条件查询
    wx.navigateTo({
      url: '/pages/conditionSearch/conditionSearch',
    })
  },

  // 展示搜索结果
  ShowSearchResult() {
    // 先获取用户输入的内容
    let {
      searchContent,
      roomInfo
    } = this.data;
    console.log(searchContent);
    let showTip = 0;
    // 遍历 roomInfo，如果模糊匹配到就展示，否则隐藏
    roomInfo.forEach((item, index) => {
      // console.log(item.roomid.indexOf(searchContent));
      if (searchContent) {
        if ((item.roomid + '').indexOf(searchContent) === -1 || (item.roomid + '').indexOf(searchContent) !== 0) {
          // 如果
          if (item.roomType.indexOf(searchContent) === -1 || item.roomType.indexOf(searchContent) !== 0) {
            item.isShow = false;
            showTip += 1;
          }
          // || item.roomType.indexOf(searchContent) === -1 || item.roomType.indexOf(searchContent) !== 0
          // 等于-1，说明模糊匹配不到，将当前项的展示状态设置为false

        }
      }
    })
    if (showTip === roomInfo.length) {
      // 提示用户无此教室
      this.setData({
        showTip: true,
      })
    } else {
      this.setData({
        showTip: false,
      })
    }
    console.log(roomInfo);
    this.setData({
      roomInfo
    })
  },

  // 开始滑动
  touchStart(e) {
    let {
      isAdmin
    } = this.data;
    if (!isAdmin) {
      return
    }
    // 标记当前时间
    this.setData({
      startTime: e.timeStamp,
    })
    console.log('touchStart=====>', e);
    let roomInfo = [...this.data.roomInfo]
    roomInfo.forEach(item => {
      // 让原先滑动的块隐藏
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    // 初始化开始位置
    this.setData({
      roomInfo: roomInfo,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  // 滑动~ 最好使用 bindtouchend，bindtouchmove会一直在检测
  touchEnd(e) {
    let {
      isAdmin
    } = this.data;
    if (!isAdmin) {
      return
    }
    let {
      startTime
    } = this.data;
    console.log(e.timeStamp - startTime);
    if (e.timeStamp - startTime < 120 || e.timeStamp - startTime > 500) {
      return
    }
    console.log('toucEnd=====>', e);
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let roomInfo = [...this.data.roomInfo]
    // 拿到滑动的角度，判断是否大于 30°，若大于，则不滑动
    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });
    console.log("angle = ", angle);
    roomInfo.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 25 || angle < -25) {
        return
      }

      // 判断是否是当前滑动的块，然后对应修改 isTouchMove 的值，实现滑动效果
      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    })

    this.setData({
      roomInfo
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除
  delItem(e) {
    let _item = e.currentTarget.dataset.item;
    let roomInfo = [...this.data.roomInfo];
    wx.showModal({
      title: '提示',
      content: '确认删除当前选中的教室吗',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          for (let i = 0; i < roomInfo.length; i++) {
            const temp = roomInfo[i];
            temp.isTouchMove = false;
            if (temp.roomid === _item.roomid) {
              this.removeRoomInfo(temp.roomid);
              roomInfo.splice(i, 1);
              break;
            }
          }
          this.setData({
            roomInfo
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
          roomInfo.forEach(item => {
            if (item.roomid === _item.roomid) {
              item.isTouchMove = false;
            }
          })
          this.setData({
            roomInfo
          })
        }
      }
    })
  },

  // roomInfo 删除操作
  removeRoomInfo(roomid) {
    wx.cloud.callFunction({
        name: 'delRoomInfoItem',
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

  // 教室条目点击事件
  handleRoomEdit(e) {
    // 获取当前 room 的编号
    // console.log(e);
    let {
      roomid
    } = e.currentTarget.dataset;
    console.log(roomid);
    // 将第一次进入教室详情页的标志写入缓存中
    wx.setStorageSync('firstEnterRoomDetail2', 1)
    wx.navigateTo({
      url: '/pages/roomDetail2/roomDetail2?roomid=' + roomid,
    })
  },

  // 新增教室按钮点击事件
  handleAddRoom(e) {
    // 获取当前 room 的编号
    wx.navigateTo({
      url: '/pages/addRoom/addRoom',
    })
    // 跳转后将当前的roomInfo数据存至全局，供下一个页面使用
    app.globalData.roomInfo = this.data.roomInfo;
  },

  // scroll-view下拉刷新事件
  onPulling(e) { //下拉中
    console.log(e, 'pulling')
  },


  onRestore(e) { //复位
    console.log(e, 'restore')
  },

  onAbort(e) { //没有下拉到refresher-threshold值
    console.log(e, 'abort')
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
    console.log("监听页面显示");
    // 加一个判断，看用户是否是第一次进入这个页面
    let first = wx.getStorageSync('firstEnterRoomsEdit');
    if (first == 1) {
      wx.setStorageSync('firstEnterRoomsEdit', 2)
      return
    }
    clearTimeout(time1); // 清除定时器
    let time1 = setTimeout(() => {
      this.onLoad();
    }, 500)
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
  },

  // // 下拉刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    console.log("监听下拉刷新");
    wx.showLoading({
      title: '刷新中...',
    })
    this.onLoad();
    // this.getData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let {
      isShowSearch
    } = this.data;
    if (isShowSearch) {
      return
    }
    console.log("监听下拉刷新");
    this.onRefresh();
    // 关闭导航栏刷新图标
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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