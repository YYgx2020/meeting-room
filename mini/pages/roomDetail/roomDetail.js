// pages/roomDetail/roomDetail.js

// 定义定时器
// let time1;
// let time2;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: 1,
    startTimeArr2: [
      ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      ['00', '30']
    ],
    startTimeArr: [
      ['16', '17'],
      ['30', '00']
    ], // 修改开始时间的选择
    endTimeArr: [
      ['18', '19'],
      ['30', '00']
    ], // 修改结束时间的选择
    disabled: false, // 是否禁用添加时间的按钮  
    addStartTime: '07:00', // 开始的时间
    addEndTime: '22:30', // 结束的时间
    addNewAppoint: true, // 增加空闲时间的标志
    currentRoomInfo: [],
    currentRoomid: '', // 当前 room 的编号
    navId: 0, // 导航标识
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dateList: [],
    dateAppointedList: [], // 每天的安排
    current: 0, // swiper的索引，默认显示第一个
    isTouch: false, // 标志是否点击room详细信息
    isTouchStartTime: false, // 标志是否要修改开始时间
    isTouchEndTime: false, // 标志是否要修改结束时间
    isShowMore: false, // 是否展示当前room的更多信息，默认不展示
    moreContentHeight: '', // 更多简介信息的高度
    defaultTop: '130rpx', // 默认的内容区的top
    itemBtnList1: ['修改时间', '我要预约', '删除当前安排'], // 时间空闲且无安排
    itemBtnList3: ['查看详情', '删除预约'], // 已经预约
    itemBtnList2: ['处理预约'], // 时间空闲，且有预约待处理
    btnListTouch: false, // 弹出层的判断标签
    appointDetail: [], // 暂存当前条目的预约安排
    appointDetailIndex: '', // 暂存当前条目的索引
    btnBottom1: '-600rpx', // 底部弹出层的位置 
    scrollTop: 0, // 滑动的距离
    isNone: false, // 处理预约 && 查看预约详情 弹出层的 弹出标志
    isNone2: false, // 修改预约时间 弹出层的 弹出标志
    isAppointComplete: false, // 标识是否完成预约
    isAppoint: false,
    defaultAppoint: [{
      time: {
        startTime: '08:00',
        endTime: '10:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '10:00',
        endTime: '12:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '12:00',
        endTime: '14:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '14:00',
        endTime: '16:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '16:00',
        endTime: '18:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '18:00',
        endTime: '20:00'
      },
      detail: '',
      status: '空闲',
    }, {
      time: {
        startTime: '20:00',
        endTime: '22:00'
      },
      detail: '',
      status: '空闲',
    }], // 默认的安排
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 先获取从当前起，七天后的日期，用于显示7天的导航栏
    this.getDefaultDate();
    console.log(options);
    console.log("扫码返回的信息：", options);
    this.setData({
      // currentRoomid: options.roomid,
      currentRoomid: "4201",
    })
    // 调用云函数获取当前教室的相关信息，用于后面展示
    this.getDateAppointList("4201");
    // this.handleShowAppointInfo();
    // 获取当前room的信息
    this.getRoomInfo("4201");
    // 获取more信息栏的高度
    clearTimeout(time1); // 清除定时器
    let time1 = setTimeout(() => {
      this.getMoreContentHeight();
    }, 1000)
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

  getRoomInfo(currentRoomid) {
    // 请求数据库获取roomInfo
    wx.cloud.database().collection('roomInfo')
      .where({
        roomid: currentRoomid * 1,
      })
      .get()
      .then(res => {
        console.log(res.data[0]);
        this.setData({
          currentRoomInfo: res.data[0]
        });
      })
      .catch(err => {
        console.log(err);
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
      // console.log(dateTemp);
      // console.log(myDate.getDay());
      dateList.push({
        id: i,
        date: dateTemp
      });
      myDate.setDate(myDate.getDate() + 1);
    }
    // console.log(dateList);
    this.setData({
      dateList
    })
  },

  // 调用云函数获取当前教室的相关预约信息
  getDateAppointList(roomid) {
    wx.cloud.callFunction({
        name: 'getDateAppointList',
        data: {
          roomid
        }
      })
      .then(res => {
        console.log(res.result.data[0].dateAppointInfo);
        let dateAppointedList = res.result.data[0].dateAppointInfo;
        // 对 dateAppointedList 进行排序
        dateAppointedList = this.dateSort(dateAppointedList);
        this.setData({
          dateAppointedList
        })
        this.handleShowAppointInfo();
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 预约信息处理
  handleShowAppointInfo() {
    let {
      dateAppointedList,
      dateList
    } = this.data;
    console.log(dateAppointedList.length);
    console.log(typeof dateAppointedList[0].date);
    console.log(dateAppointedList[0].date);
    // 判断安排的日期的长度
    if (dateAppointedList.length < 7) {
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
    } else {
      // 如果安排的日期长度大于7，默认取出前7个，将导航栏中的日期与安排的日期进行逐一匹配
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
    }

  },

  // 获取more信息栏的高度
  getMoreContentHeight() {
    // 获取简介信息的高度
    const query = wx.createSelectorQuery()
    query.select('#the-id').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      console.log(res[0]);
      res[0].top // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      // return res[0].height
      this.setData({
        moreContentHeight: res[0].height
      })
    })
  },

  // 头部标题点击事件
  headerTouch() {
    let isTouch = !this.data.isTouch;
    console.log(isTouch);
    if (isTouch) {
      // 设置more可见
      this.setData({
        isShowMore: true
      })
      let {
        moreContentHeight
      } = this.data;
      console.log(moreContentHeight);
      // 修改内容区的top
      this.setData({
        defaultTop: moreContentHeight * 1 * 2 + 130 + 'rpx'
      })
    } else {
      this.setData({
        defaultTop: '130rpx',
      })
    }
    this.setData({
      isTouch
    })
  },

  // 头部查询按钮
  handleSearchBtn() {
    console.log("管理员点击了查询");
    /**
     * 查询逻辑：
     * 
     */
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
      addNewAppoint: true,
      current: e.detail.current,
      navId: e.detail.current
    })
    let {
      dateList
    } = this.data;
    if (dateList[e.detail.current].appointArr.length === 0) {
      console.log("当前日期是程序自动生成的");
      this.setData({
        disabled: true,
      })
    } else {
      this.setData({
        disabled: false,
      })
    }
  },

  // 监听页面滑动
  onPageScroll: function (e) {
    console.log(e); //{scrollTop:99}
    this.setData({
      scrollTop: Math.trunc(e.scrollTop),
    })
  },

  // 滚动选择器的点击事件
  bindPickerChange(e) {
    console.log(e);
    // 先看状态
    let {
      status,
      detail
    } = e.currentTarget.dataset.item;
    // 将当前项的预约信息传给 appointDetail
    this.setData({
      appointDetail: e.currentTarget.dataset.item.detail,
      appointDetailIndex: e.currentTarget.dataset.index,
    })
    // 获取data中的数据
    let {
      dateList,
      current,
      appointDetail,
      appointDetailIndex,
      dateAppointedList,
      currentRoomid,
      defaultAppoint,
      scrollTop
    } = this.data;
    let bottom1 = (-300 - scrollTop) * 2 + 'rpx';
    console.log(bottom1);
    console.log(appointDetailIndex);
    // 标记当前日期
    let currentDate = dateList[current].date.split(" ")[0];
    console.log(currentDate);

    // 先看当前日期是否有安排，
    if (dateList[current].appointArr.length === 0) {
      console.log("当前日期展示的是默认的安排");
      // 默认的安排展示的状态都是空闲
      if (e.detail.value === '0') {
        console.log("默认安排的修改时间");
        wx.setNavigationBarColor({
          backgroundColor: '#676767',
          frontColor: '#000000',
        })
        // 弹出修改时间的下弹窗
        this.setData({
          isNone2: true,
          isNone: false,
          isup2: true,
          btnListTouch: true,
          btnBottom1: bottom1,
        })

        // 设置修改时间的动画
        this.animate('.alterCurrentAppointTime', [{
            ease: 'linear',
            translateY: scrollTop
            // translateY: -30  // 这个不可行，弹窗距离底部的初始值不要改，就固定是弹出层的高度
          },
          {
            ease: 'linear',
            // translateY: -330 + scrollTop
            translateY: -300
          },
        ], 250)


        // 获取当前条目的开始时间和结束时间
        let startTimeHour = defaultAppoint[appointDetailIndex].time.startTime.split(':')[0] * 1;
        let endTimeHour = defaultAppoint[appointDetailIndex].time.endTime.split(':')[0] * 1;
        let startTimeArr = [],
          endTimeArr = [];

        if (appointDetailIndex !== 6) {
          startTimeArr.push([(startTimeHour + ''), (startTimeHour + 1 + '')]);
          startTimeArr.push(['00', '30']);
          endTimeArr.push([(endTimeHour - 1 + ''), (endTimeHour + ''), (endTimeHour + 1 + '')]);
          endTimeArr.push([('00'), ('30')]);
        } else {
          startTimeArr.push([(startTimeHour + ''), (startTimeHour + 1 + '')]);
          startTimeArr.push(['00', '30']);
          endTimeArr.push([(endTimeHour - 1 + ''), (endTimeHour + '')]);
          endTimeArr.push([('00'), ('30')]);
        }
        this.setData({
          currentStartTime: defaultAppoint[appointDetailIndex].time.startTime,
          currentEndTime: defaultAppoint[appointDetailIndex].time.endTime,
          startTimeArr,
          endTimeArr
        })
      } else if (e.detail.value === '1') {
        console.log("默认安排的我要预约");
        // 新开一个页面填写预约信息，传入当前时间段的开始时间和结束时间以及当前日期，以及后一个时间段的开始时间和结束时间还有状态
        wx.navigateTo({
          url: '/pages/newAppointment/newAppointment',
        })
      } else if (e.detail.value === '2') {
        console.log("默认安排的删除");
        // 创建一个 appointArr 
        let appointArr = [];
        // 遍历当前日期所有的安排（默认的），
        defaultAppoint.forEach((item, index) => {
          if (index !== appointDetailIndex) {
            appointArr.push(item);
          }
        })
        dateList[current].appointArr = appointArr;
        this.setData({
          dateList
        })
      }
      // 默认安排产生操作之后要把数据更新到 dateList 中

    } else {
      // 如果当前条目的状态是 空闲
      if (status === '空闲') {
        // 如果当前空闲时间段有预约待处理，则显示处理预约的选择器
        if (detail !== '') {
          // 说明有安排 itemBtnList2: ['处理预约']
          if (e.detail.value === "0") {
            wx.setNavigationBarColor({
              backgroundColor: '#676767',
              frontColor: '#000000',
            })
            // 弹出处理预约的下弹窗
            this.setData({
              isAppointComplete: false,
              isNone: true,
              isNone2: false,
              isup: true,
              btnListTouch: true,
              btnBottom1: bottom1,
            })

            this.animate('.handleReservation', [{
                ease: 'linear',
                translateY: scrollTop
              },
              {
                ease: 'linear',
                translateY: -300
              },
            ], 250)
          }
        } else {
          // 说明当前空闲时间段无任何安排，显示的选择条目：itemBtnList1: ['修改时间', '我要预约', '删除当前安排']
          if (e.detail.value === "0") {
            // 修改时间
            console.log("修改时间");
            wx.setNavigationBarColor({
              backgroundColor: '#676767',
              frontColor: '#000000',
            })
            // 弹出修改时间的下弹窗
            this.setData({
              isAppointComplete: false,
              isNone: false,
              isNone2: true,
              isup: true,
              btnListTouch: true,
              btnBottom1: bottom1,
            })

            this.animate('.alterCurrentAppointTime', [{
                ease: 'linear',
                translateY: scrollTop
              },
              {
                ease: 'linear',
                translateY: -300
              },
            ], 250)

            // 获取当前条目的开始时间和结束时间
            let startTimeHour = dateList[current].appointArr[appointDetailIndex].time.startTime.split(':')[0] * 1;
            let endTimeHour = dateList[current].appointArr[appointDetailIndex].time.endTime.split(':')[0] * 1;
            let startTimeArr = [],
              endTimeArr = [];

            // 这里还得看后面的安排条目有没有预约，如果后面的安排条目有预约，则
            if (appointDetailIndex !== dateList[current].appointArr.length - 1) {
              // 如果不是最后一个条目
              startTimeArr.push([(startTimeHour - 1 + ''), (startTimeHour + ''), (startTimeHour + 1 + '')]);
              startTimeArr.push(['00', '30']);
              endTimeArr.push([(endTimeHour - 1 + ''), (endTimeHour + ''), (endTimeHour + 1 + '')]);
              endTimeArr.push(['00', '30']);
            } else {
              startTimeArr.push([(startTimeHour - 1 + ''), (startTimeHour + ''), (startTimeHour + 1 + '')]);
              startTimeArr.push(['00', '30']);
              endTimeArr.push([(endTimeHour - 1 + ''), (endTimeHour + '')]);
              endTimeArr.push(['00', '30']);
            }

            this.setData({
              currentStartTime: dateList[current].appointArr[appointDetailIndex].time.startTime,
              currentEndTime: dateList[current].appointArr[appointDetailIndex].time.endTime,
              startTimeArr,
              endTimeArr
            })

          } else if (e.detail.value === "1") {
            // 我要预约
            console.log("我要预约");
            // 新开一个页面填写预约信息，传入当前时间段的开始时间和结束时间，以及后一个时间段的开始时间和结束时间还有状态
            wx.navigateTo({
              url: '/pages/newAppointment/newAppointment',
            })
          } else if (e.detail.value === "2") {
            // 删除当前安排
            console.log("删除当前安排");
            dateList[current].appointArr.splice(appointDetailIndex, 1)
            this.setData({
              dateList
            })
            // 更新到数据库中
            // this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
          }
        }
      } else if (status === '已预约') {
        // 显示的选择条目：itemBtnList3: ['查看详情', '删除预约']
        if (e.detail.value === "0") {
          wx.setNavigationBarColor({
            backgroundColor: '#676767',
            frontColor: '#000000',
          })
          // 弹出查看详情的下弹窗
          this.setData({
            isAppointComplete: true,
            isNone: true,
            isNone2: false,
            isup: true,
            btnListTouch: true,
            btnBottom1: bottom1,
          })

          this.animate('.handleReservation', [{
              ease: 'linear',
              translateY: scrollTop
            },
            {
              ease: 'linear',
              translateY: -300
            },
          ], 250)
        } else if (e.detail.value === "1") {
          console.log("删除预约");
          // 再弹一个拟态窗口出来问管理员是否确定删除
          wx.showModal({
            title: "提示",
            content: "确认要删除当前已经预约的时间段吗",
            success: res => {
              if (res.confirm) {
                // 将当前已经预约的时间段删除掉
                // 删除当前安排
                console.log("删除当前安排");
                dateList[current].appointArr.splice(appointDetailIndex, 1)
                this.setData({
                  dateList
                })
                // 更新到数据库中
                // this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
              } else if (res.cancel) {
                this.backgroundCoverTouch();
              }
            }
          })
        }
      }
    }


  },

  // 修改开始时间的事件
  handleStartTime(e) {
    // 获取开始时间
    let {
      startTimeArr,
      defaultAppoint,
      appointDetailIndex
    } = this.data;
    console.log(e);
    let index1 = e.detail.value[0];
    let index2 = e.detail.value[1];
    console.log(startTimeArr);
    console.log("当前安排的开始时间为：", defaultAppoint[appointDetailIndex].time.startTime);
    console.log("管理员选中的开始时间为：", startTimeArr[0][index1] + ":" + startTimeArr[1][index2]);
    let currentStartTime = startTimeArr[0][index1] + ":" + startTimeArr[1][index2];
    this.setData({
      currentStartTime
    })
  },

  // 修改结束时间的事件
  handleEndTime(e) {
    let {
      endTimeArr,
      defaultAppoint,
      appointDetailIndex
    } = this.data;
    console.log(e);
    let index1 = e.detail.value[0];
    let index2 = e.detail.value[1];
    console.log(endTimeArr);
    console.log("当前安排的开始时间为：", defaultAppoint[appointDetailIndex].time.endTime);
    console.log("管理员选中的开始时间为：", endTimeArr[0][index1] + ":" + endTimeArr[1][index2]);
    let currentEndTime = endTimeArr[0][index1] + ":" + endTimeArr[1][index2];
    this.setData({
      currentEndTime
    })
  },

  // 管理员点击确定之后再判断选中的时间是否合理
  handleAlterConfirm() {
    // 先把简介信息收起来
    let isTouch = !this.data.isTouch;
    this.setData({
      isTouch
    })
    console.log("管理员点击了确定");

    // 如果管理员没有选中开始时间，也没有选中结束时间，直接点击确定，那么如何判断/处理
    let {
      currentStartTime,
      currentEndTime,
      defaultAppoint,
      appointDetailIndex,
      dateList,
      current
    } = this.data;
    // 先判断开始时间和结束有无修改，有修改再更新到页面和数据库中，没有更改就不管了
    if (currentStartTime === defaultAppoint[appointDetailIndex].time.startTime && currentEndTime === defaultAppoint[appointDetailIndex].time.endTime) {
      console.log("当前时间段没有进行任何修改");
      return; // 直接返回
    } else {
      // 先判断时间上是否合理
      // 1. 是否小于1个小时
      // 获取各个时间节点
      let startHour = currentStartTime.split(':')[0] * 1;
      let startMin = currentStartTime.split(':')[1] * 1;
      let endHour = currentEndTime.split(':')[0] * 1;
      let endMin = currentEndTime.split(':')[1] * 1;
      // 计算时间长度
      let hour = endHour - startHour;
      let min = endMin - startMin;
      let timelength = '';
      if (min > 0) {
        timelength = hour + 0.5;
      } else if (min < 0) {
        timelength = hour - 0.5;
      } else {
        timelength = hour;
      }

      console.log("当前选中的时间长度为：", timelength + "小时");
      // 判断时间长度是否符合要求
      if (timelength < 1) {
        console.log("当前选中的时间长度小于1小时");
        wx.showToast({
          title: '您当前选中的时间不符合要求',
          icon: 'none'
        })
      } else if (timelength > 3) {
        console.log("当前选中的时间长度大于3小时");
        wx.showToast({
          title: '您当前选中的时间不符合要求',
          icon: 'none'
        })
      } else {

        // 符合要求则更新到列表和数据库中
        // 查看当前选中的时间更新之后是否影响到后面的时间，有影响则将后面的时间也更新
        // 创建一个 appointArr 
        let appointArr = [];
        // 先判断当前修改的时间段是来自数据库中已经安排好的时间段还是程序默认的时间段
        if (dateList[current].appointArr.length === 0) {
          // 这里采用的是程序默认的时间段，更改完后将更改的数据加入到数据库中
          if (endHour - (defaultAppoint[appointDetailIndex].time.endTime.split(':')[0] * 1) === 1 && endMin === 30) {
            console.log("删除后续的时间段");
            // 遍历当前日期所有的安排（默认的），
            defaultAppoint.forEach((item, index) => {
              if (index !== appointDetailIndex) {
                if (index !== appointDetailIndex + 1) {
                  appointArr.push(item);
                }
              } else if (index === appointDetailIndex) {
                if (startMin === 0) {
                  startMin = startMin + '0';
                }
                item.time.startTime = startHour + ':' + startMin;
                if (endMin === 0) {
                  endMin = endMin + '0';
                }
                item.time.endTime = endHour + ':' + endMin;
                appointArr.push(item);
              }
            })
          } else {
            // 更改后面的时间段
            console.log("更改后面的时间段");
            // 判断当前时间段的结束时间是否与后一个时间段的开始时间冲突
            let _nextStartHour = defaultAppoint[appointDetailIndex + 1].time.startTime.split(":")[0] * 1;
            let _nextStartMin = defaultAppoint[appointDetailIndex + 1].time.startTime.split(":")[1] * 1;
            // 遍历当前日期所有的安排（默认的）
            defaultAppoint.forEach((item, index) => {
              // 先改当前索引项的时间
              if (index === appointDetailIndex) {
                if (startMin === 0) {
                  startMin = startMin + '0';
                }
                item.time.startTime = startHour + ':' + startMin;
                if (endMin === 0) {
                  endMin = endMin + '0';
                }
                item.time.endTime = endHour + ':' + endMin;
                appointArr.push(item);
              } else if (index === appointDetailIndex + 1) {
                if (endHour >= _nextStartHour) {
                  if (endMin === 0) {
                    endMin = endMin + '0';
                  }
                  item.time.startTime = endHour + ':' + endMin;
                }
                appointArr.push(item);
              } else {
                appointArr.push(item);
              }
            })
          }
        } else {
          // 如果当前时间段的后一个时间段是空闲状态，并且没有预约待处理，则相应的更改后续的时间段
          // 因为处理有安排的时间段时，开始时间可以往前设置，所以要先判断开始时间是否与前一个安排的结束时间冲突了
          // 如果当前时间段是第一个，则忽略
          /**
           * 1 先判断设置的时间长度是否合理 -- 上面已经进行过判断
           * 2 判断设置的开始时间有无冲突（设置一个标志位，无冲突则跳转到结束时间的判断）
           *  2.1 如果当前选中的条目是第一个，则无冲突
           *  2.2 如果当前选中的条目不是第一个，则判断当前条目的开始时间是否与前一个条目的结束时间冲突
           * 2 如果开始时间没有冲突（标志位为true），则开始进行结束时间冲突的判断
           *  2.1 如果下一个条目的状态是空闲但有预约待处理或者已预约，则结束时间不能大于下一条目的开始时间（再设置一个标志位，来标志结束时间是否合理）
           * 3. 如果开始时间和结束时间都合理，则再允许修改
           */

          let isStartTimeReasonable = false; // 设置判断开始时间是否合理的标志位
          let isEndTimeReasonable = true; // 设置判断结束时间是否合理的标志位
          if (appointDetailIndex === 0) {
            // 如果当前选中的条目是第一个，则无冲突
            isStartTimeReasonable = true;
          } else {
            // 如果当前选中的条目不是第一个，则判断当前选中的开始时间是否与前一个时间段的开始时间冲突
            let preHour = dateList[current].appointArr[appointDetailIndex - 1].time.startTime.split(":")[0] * 1;
            let preMin = dateList[current].appointArr[appointDetailIndex - 1].time.startTime.split(":")[1] * 1;
            if (startHour < preHour) {
              wx.showToast({
                title: '当前设置的开始时间与前一个时间段冲突',
                icon: 'none'
              })
            } else if (startHour === preHour) {
              if (startMin < preMin) {
                wx.showToast({
                  title: '当前设置的开始时间与前一个时间段冲突',
                  icon: 'none'
                })
              }
            } else {
              // 开始时间没有冲突，才可以判断结束时间
              isStartTimeReasonable = true;
            }
          }
          // 判断结束时间是否冲突
          if (appointDetailIndex !== dateList[current].appointArr.length - 1) {
            var nextHour = dateList[current].appointArr[appointDetailIndex + 1].time.startTime.split(":")[0] * 1;
            var nextMin = dateList[current].appointArr[appointDetailIndex + 1].time.startTime.split(":")[1] * 1;
            var nextEndHour = dateList[current].appointArr[appointDetailIndex + 1].time.endTime.split(":")[0] * 1;
            var nextEndMin = dateList[current].appointArr[appointDetailIndex + 1].time.endTime.split(":")[1] * 1;
          }
          if (isStartTimeReasonable) {
            // 先判断后面一个安排是已预约或者空闲但有预约待处理状态
            if (appointDetailIndex !== dateList[current].appointArr.length - 1) {
              let nextAppointStatus = dateList[current].appointArr[appointDetailIndex + 1].status;
              if ((nextAppointStatus === '空闲' && dateList[current].appointArr[appointDetailIndex + 1].detail !== '') || (nextAppointStatus === '已预约')) {
                // 判断当前选中的结束时间是否与下一个安排的开始时间冲突，如果冲突则不给安排
                if ((endHour === nextHour && endMin === 30) || (endHour > nextHour)) {
                  console.log("下一个时间段有安排，且当前选中的结束时间与下一个时间段的开始时间冲突了");
                  isEndTimeReasonable = false;
                  // 直接return
                  wx.showModal({
                    title: "提示",
                    content: "下一个时间段有安排，且当前选中的结束时间与下一个时间段的开始时间冲突，请重新选择结束时间",
                  })
                  return
                }
              }
            }
          }

          if (isStartTimeReasonable && isEndTimeReasonable) {
            // 开始时间和结束时间都合理，则更改当前的时间段，然后再判断后一个的时间段是否也要更改
            // 如果当前选中的条目是最后一个或者当前选中的结束时间小于下一个条目的开始时间，则无需更改下一个时间段
            if ((appointDetailIndex === dateList[current].appointArr.length - 1) || (endHour < nextHour)) {
              dateList[current].appointArr.forEach((item, index) => {
                if (index === appointDetailIndex) {
                  if (startMin === 0) {
                    startMin = startMin + '0';
                  }
                  if (endMin === 0) {
                    endMin = endMin + '0';
                  }
                  item.time.startTime = startHour + ':' + startMin;
                  item.time.endTime = endHour + ':' + endMin;
                  appointArr.push(item);
                } else {
                  appointArr.push(item);
                }
              })
            } else {
              if ((nextEndHour - endHour + nextEndMin - endMin) > 1) {
                console.log((nextEndHour - endHour + nextEndMin - endMin));
                // 更改后一个时间段的开始时间
                dateList[current].appointArr.forEach((item, index) => {
                  if (index === appointDetailIndex) {
                    if (startMin === 0) {
                      startMin = startMin + '0';
                    }
                    if (endMin === 0) {
                      endMin = endMin + '0';
                    }
                    item.time.startTime = startHour + ':' + startMin;
                    item.time.endTime = endHour + ':' + endMin;
                    appointArr.push(item);
                  } else if (index === appointDetailIndex + 1) {
                    if (endMin === 0) {
                      endMin = endMin + '0';
                    }
                    item.time.startTime = endHour + ":" + endMin; // 只用改开始时间
                    appointArr.push(item);
                  } else {
                    appointArr.push(item);
                  }
                })
              } else {
                console.log((nextEndHour - endHour + nextEndMin - endMin));
                // 小于1则直接删除(不加入数组中)
                dateList[current].appointArr.forEach((item, index) => {
                  if (index === appointDetailIndex) {
                    if (startMin === 0) {
                      startMin = startMin + '0';
                    }
                    if (endMin === 0) {
                      endMin = endMin + '0';
                    }
                    item.time.startTime = startHour + ':' + startMin;
                    item.time.endTime = endHour + ':' + endMin;
                    appointArr.push(item);
                  } else if (index === appointDetailIndex + 1) {
                    if ((nextEndHour - endHour + nextEndMin - endMin) >= 1) {
                      appointArr.push(item);
                    }
                  } else {
                    appointArr.push(item);
                  }

                })
              }
            }
          }
        }
        dateList[current].appointArr = appointArr;
        this.setData({
          dateList
        })
        // 更新到数据库中

        // 隐藏弹出层
        this.backgroundCoverTouch();
      }
    }
  },

  // 添加空闲时间事件
  handleAddFreeTime() {
    let {
      first,
      current,
      dateList,
    } = this.data;
    // 如果当前日期是程序默认安排的，则告知管理员不可再添加，不用告知，直接禁用按钮
    if (dateList[current].appointArr.length === 0) {
      this.setData({
        disabled: true,
      })
      return
      // wx.showModal({
      //   title: '提示',
      //   content: '当前日期展示的安排由程序自动生成，如您需要添加空闲时间段，请删除部分时间后再添加',
      //   success(res) {
      //     if (res.confirm) {
      //       return
      //     } else if (res.cancel) {
      //       return
      //     }
      //   }
      // })
    } else if (first === 1) {
      this.setData({
        disabled: false,
      })
      // 弹出一个窗口告知管理员可添加的时间的长度
      wx.showModal({
        title: '提示',
        content: '添加的空闲时间长度不可小于1小时，也不可大于3小时，如您需要添加一大段的空闲时间，请分段添加'
      })
      this.setData({
        first: 2
      })

      // 显示时间选择器
      this.setData({
        addNewAppoint: false
      })
    } else {
      this.setData({
        disabled: false,
      })
      // 显示时间选择器
      this.setData({
        addNewAppoint: false
      })
    }
    console.log("管理员要添加空闲时间");


  },

  // 生成二维码事件
  handleGenerateQr() {
    console.log("生成二维码事件");
    let roomid = '4201';
    wx.setNavigationBarColor({
      backgroundColor: '#676767',
      frontColor: '#000000',
    })
    this.setData({
      btnListTouch: true,
    })
    wx.showLoading({
      title: '二维码生成中',
      mask: true,
    })
    // 新开一个页面展示二维码
    // 云调用生成二维码
    wx.cloud.callFunction({
        name: 'generateQr',
        data: {
          path: 'pages/roomDetail/roomDetail?roomid=' + roomid,
          name: '4201',
        }
      })
      .then(res => {
        console.log(res);
        wx.hideLoading({
          success: (res2) => {
            console.log(res2);
            // 成功后跳转到一个新的页面展示二维码
            wx.navigateTo({
              url: '/pages/showRoomQrimg/showRoomQrimg?fileID=' + res.result.fileID,
            })
          },
        })

      })
      .catch(err => {
        console.log(err);
      })
  },

  // 开始时间选择器的监听
  handleAddStartTime(e) {
    let {
      startTimeArr2
    } = this.data;
    console.log(e.detail.value);
    console.log(startTimeArr2[0][e.detail.value[0]]);
    console.log(startTimeArr2[1][e.detail.value[1]]);
    this.setData({
      addStartTime: startTimeArr2[0][e.detail.value[0]] + ":" + startTimeArr2[1][e.detail.value[1]],
    })
  },

  // 结束时间选择器的监听
  handleAddEndTime(e) {
    // 获取开始时间
    let {
      startTimeArr2,
      addStartTime
    } = this.data;
    let addEndTime = startTimeArr2[0][e.detail.value[0]] + ":" + startTimeArr2[1][e.detail.value[1]];
    // 拆分时间
    let addStartTimeHour = addStartTime.split(":")[0] * 1;
    let addStartTimeMin = addStartTime.split(":")[1] * 1;
    let addEndTimeHour = addEndTime.split(":")[0] * 1;
    let addEndTimeMin = addEndTime.split(":")[1] * 1;
    // console.log(addEndTimeHour - addStartTimeHour + addEndTimeMin - addStartTimeMin);
    let hour = addEndTimeHour - addStartTimeHour;
    let min = addEndTimeMin - addStartTimeMin;
    let timelength = 0;
    if (min > 0) {
      timelength = hour + 0.5;
    } else if (min < 0) {
      timelength = hour - 0.5;
    } else {
      timelength = hour;
    }
    if (timelength > 3 || timelength < 1) {
      // 提示管理员时间长度不对
      wx.showToast({
        title: '时间长度错误',
        icon: 'error',
      })
      return
    }

    console.log(e);
    this.setData({
      addEndTime
    })
  },

  // 添加时间的确定
  handleAddConfirm() {
    console.log("有没有反应");
    /**
     * 选择时间之后的处理
     * 1 先判断选中的开始时间和结束时间是否符合 1-3 个小时的要求
     * 2 再判断时间是否有冲突
     */
    // 获取当前日期的安排
    let {
      addStartTime,
      addEndTime,
      current,
      dateList,
      defaultAppoint
    } = this.data;
    // 拆分时间
    let addStartTimeHour = addStartTime.split(":")[0] * 1;
    let addStartTimeMin = addStartTime.split(":")[1] * 1;
    let addEndTimeHour = addEndTime.split(":")[0] * 1;
    let addEndTimeMin = addEndTime.split(":")[1] * 1;
    let flagStart = false,
      flagEnd = false;
    let startTimeIndex = 0;
    // 看当前日期是默认的还是有安排的
    // 由于之前设置默认的安排时间不可直接添加，然后又设置了默认时间修改后就添加到数据库中，所以这里直接用有安排的那个数组来操作就行了
    // 先检查开始时间
    let appointArr = dateList[current].appointArr;
    for (let i = 0; i < appointArr.length; i++) {
      // 开始的小时应该小于当前遍历的开始时间 并且 大于或等于前一个的结束时间
      // 先判断是否到达末尾，防止数组越界
      if (i !== 0) {
        if (addStartTimeHour >= appointArr[i - 1].time.endTime.split(":")[0] * 1 && addStartTimeHour < appointArr[i].time.startTime.split(":")[0] * 1) {
          // 说明开始时间合适
          flagStart = true;
          startTimeIndex = i;
          console.log(startTimeIndex);
          console.log("开始时间合理");
          break
        }
      } else {
        if (addStartTimeHour < appointArr[i].time.startTime.split(":")[0] * 1) {
          // 说明开始时间合适
          flagStart = true;
          startTimeIndex = i;
          console.log(startTimeIndex);
          console.log("开始时间合理");
          break
        }
      }
    }

    // 再对开始时间进行一次判断
    if (addStartTimeHour >= appointArr[appointArr.length - 1].time.endTime.split(":")[0] * 1) {
      flagStart = true;
      startTimeIndex = appointArr.length - 1;
      console.log(startTimeIndex);
      console.log("开始时间合理");
    }

    // 再检查结束时间
    for (let i = 0; i < appointArr.length; i++) {
      if (i === 0) {
        if (addEndTimeHour < appointArr[i].time.startTime.split(":")[0] * 1) {
          flagEnd = true;
          console.log("结束时间合理");
          break
        } else if (addEndTimeHour === appointArr[i].time.startTime.split(":")[0] * 1 && addEndTimeMin === appointArr[i].time.startTime.split(":")[1] * 1) {
          flagEnd = true;
          console.log("结束时间合理");
          break
        }
      } else {
        // 如果不是第一个，那就要小于或等于当前项的开始时间，大于前一项的结束时间，不能等于
        if (addEndTimeHour < appointArr[i].time.startTime.split(":")[0] * 1 && addEndTimeHour > appointArr[i - 1].time.endTime.split(":")[0] * 1) {
          flagEnd = true;
          console.log("结束时间合理");
          break
        } else if (addEndTimeHour === appointArr[i].time.startTime.split(":")[0] * 1 && addEndTimeMin === appointArr[i].time.startTime.split(":")[1] * 1) {
          flagEnd = true;
          console.log("结束时间合理");
          break
        }
      }
    }

    // 再对结束时间进行一次判断
    if (addEndTimeHour > appointArr[appointArr.length - 1].time.endTime.split(":")[0] * 1) {
      flagEnd = true;
      console.log("结束时间合理");
    }

    if (flagStart && flagEnd) {
      console.log("当前设置的空闲时间合理，可以插入");
    } else {
      console.log("当前设置的空闲时间不合理，不可以插入");
    }
  },


  // 添加时间的返回
  handleAddReturn() {
    this.setData({
      addStartTime: '07:00',
      addEndTime: '22:30',
      addNewAppoint: true,
    })
  },

  // 蒙板点击事件
  backgroundCoverTouch() {
    // 设置导航栏的颜色，让其与背景蒙版的颜色一致
    wx.setNavigationBarColor({
      backgroundColor: '#ffffff',
      frontColor: '#000000',
    })
    this.setData({
      isup2: false,
      isup: false,
      btnListTouch: false,
      // btnBottom1: '-600rpx',
      isNone: false,
      isNone2: false
    })

  },

  // 处理预约事件监听 -- 不同意预约
  handleDisagree() {
    console.log("管理员不同意预约");
    // 0. 恢复原来的页面，相当于点击蒙版
    this.backgroundCoverTouch();
    // 1. 不同意预约，则将当前时间段的 detail 置为空字符串
    let {
      dateList,
      current,
      appointDetail,
      appointDetailIndex,
      dateAppointedList,
      currentRoomid
    } = this.data;
    console.log(appointDetail, appointDetailIndex);

    // 标记当前日期
    let currentDate = dateList[current].date.split(" ")[0];
    console.log(currentDate);
    dateList[current].appointArr.forEach((item, index) => {
      console.log(item);
      if (index === appointDetailIndex) {
        // 修改当前项数据
        item.detail = '';
        return item
      }
    })
    this.setData({
      dateList
    })
    // 2. 将更改的数据同步到数据库中
    // 这里要使用云函数，云函数才有更新权限，普通的只能查询
    this.updateRoomAppointInfo(currentRoomid, dateAppointedList);
    // 3. 消息订阅提醒预约申请人，预约成功
    // 后面可以写一个打回理由，告知申请者被打回的原因
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

  // 处理预约事件监听 -- 同意预约
  handleAgree() {
    console.log("管理员同意预约");
    // 0. 恢复原来的页面，相当于点击蒙版
    this.backgroundCoverTouch();

    /**
     * 1. 更改当前时间段的状态
     * 1.1 获取 dateList
     * 1.2 匹配到当前的 swiper-item
     * 1.3 再去 appointArr 中匹配到当前的条目
     */
    let {
      dateList,
      current,
      appointDetail,
      appointDetailIndex,
      dateAppointedList,
      currentRoomid
    } = this.data;
    console.log(appointDetail, appointDetailIndex);

    // 标记当前日期
    let currentDate = dateList[current].date.split(" ")[0];
    console.log(currentDate);
    dateList[current].appointArr.forEach((item, index) => {
      console.log(item);
      if (index === appointDetailIndex) {
        // 修改当前项数据
        item.status = "已预约";
        item.detail.appointTime.startTime = appointDetail.appointTime.startTime;
        item.detail.appointTime.endTime = appointDetail.appointTime.endTime;
        item.time.startTime = appointDetail.appointTime.startTime;
        item.time.endTime = appointDetail.appointTime.endTime;
        item.detail.contactName = appointDetail.contactName;
        item.detail.things = appointDetail.things;
        item.detail.applyTime = appointDetail.applyTime;
        return item
      }
    })
    this.setData({
      dateList
    })
    // 2. 将更改的数据同步到数据库中
    // 这里要使用云函数，云函数才有更新权限，普通的只能查询
    wx.cloud.callFunction({
        name: 'updateRoomAppointInfo',
        data: {
          roomid: currentRoomid,
          dateAppointInfo: dateAppointedList
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    // 3. 消息订阅提醒预约申请人，预约成功
  },

  // 查看预约详情的确定按钮
  handleConfirm() {
    this.backgroundCoverTouch();
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
    // 管理员返回当前页面后要把蒙版去掉
    wx.setNavigationBarColor({
      backgroundColor: '#ffffff',
      frontColor: '#000000',
    })
    this.setData({
      btnListTouch: false,
    })
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