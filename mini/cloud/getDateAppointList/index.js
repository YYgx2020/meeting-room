// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * 获取roomid相关的全部的日期安排
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  return cloud.database().collection('roomAppointInfo')
    .where({
      roomid: event.roomid
    })
    .get()

}