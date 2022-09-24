// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * 更新 roomAppointInfo 中的预约信息
 * @param {roomid, dateAppointInfo} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  return cloud.database().collection("roomAppointInfo")
    .where({
      roomid: event.roomid
    })
    .update({
      data: {
        dateAppointInfo: event.dateAppointInfo
      }
    })
}