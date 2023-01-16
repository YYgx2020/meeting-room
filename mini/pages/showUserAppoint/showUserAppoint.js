// pages/showUserAppoint/showUserAppoint.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [{
      'id': 0,
      'navName': '待审核'
    }, {
      'id': 1,
      'navName': '预约成功'
    }, {
      'id': 2,
      'navName': '预约失败'
    }],
    navId: 0,
    current: 0,
    openid: '',
    appointArr: [], // 用户预约表
    // 分类存储
    swiperItem: [[], [], []],
    // swiperItem1: [],  // 待审核
    // swiperItem2: [],  // 预约成功
    // swiperItem3: [],  // 预约失败
    showMore: false, // 是否展示更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: app.globalData.openid,
    })

    let isAgree = 0;
    this.getUserAppointInfo(isAgree);
  },

  // 获取用户的预约表
  // 获取用户的预约表
  getUserAppointInfo(isAgree) {
    let {
      openid,
      current,
      swiperItem
    } = this.data;
    // 发请求之前先查看是否有数据
    if (swiperItem[current].length === 0) {
      wx.showToast({
        title: '数据加载中',
        mask: true,
        duration: 3000,
        icon: 'loading'
      })
      wx.cloud.database().collection('userAppointInfo')
        .where({
          openid,
          isAgree
        })
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          wx.hideToast();
          console.log(res);
          res.data.map(item => {
            item['showMore'] = false;
          })
          swiperItem[current] = res.data;
          this.setData({
            swiperItem,
          })
        })
        .catch(err => {
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '预约信息获取失败，请退出重试',
            success: res => {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          console.log(err);
        })
    } else {
      return
    }

  },

  // 数据的初始化
  dataInit(appointArr) {
    // let {
    //   swiperItem
    // } =this.data;
    let swiperItem = [
      [],
      [],
      []
    ];
    appointArr.forEach(item1 => {
      if (item1.isAgree === 0) {
        swiperItem[0].push(item1);
      } else if (item1.isAgree === 1) {
        swiperItem[2].push(item1);
      } else {
        swiperItem[1].push(item1);
      }
    })
    this.setData({
      swiperItem
    })
  },

  // 导航栏点击事件
  changeNav(e) {
    let navId = e.currentTarget.id * 1;
    this.setData({
      navId,
      current: navId,
    })
    // 发起请求，重新获取数据
    switch (navId) {
      case 0:
        this.getUserAppointInfo(0);
        break;
      case 1:
        this.getUserAppointInfo(1);
        break;
      case 2:
        this.getUserAppointInfo(-1);
        break;
    }
  },

  // 监听swiper变换事件
  swiperChange(e) {
    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    this.setData({
      // addNewAppoint: true,
      current: e.detail.current,
      navId: e.detail.current
    })
  },

  handleShowMore(e) {
    console.log(e);
    let {index} = e.currentTarget.dataset;
    let {
      current,
      swiperItem,
    } = this.data;
    // console.log(swiperItem[current][index].showMore);
    swiperItem[current][index].showMore = !swiperItem[current][index].showMore;
    this.setData({
      swiperItem,
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