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
    swiperItem: [],
    showMore: false, // 是否展示更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: app.globalData.openid,
    })
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    this.getUserAppointInfo();
  },

  // 获取用户的预约表
  // 获取用户的预约表
  getUserAppointInfo() {
    let {
      openid
    } = this.data;
    wx.cloud.database().collection('userAppointInfo')
      .where({
        openid,
      })
      .get()
      .then(res => {
        wx.hideLoading()
        console.log(res);
        let appointArr = res.data[0].appointArr.reverse();
        this.dataInit(appointArr);
        // this.setData({
        //   appointArr: res.data[0].appointArr.reverse(),
        // })
      })
      .catch(err => {
        console.log(err);
      })
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
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    })
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

  handleShowMore() {
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