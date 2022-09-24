// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('roomInfo')
    .add({ // 添加数据
      data: {
        roomCoverImg: event.roomInfo.roomCoverImg,
        fileID: event.roomInfo.fileID,
        roomid: event.roomInfo.roomid,
        roomPeople: event.roomInfo.roomPeople,
        roomType: event.roomInfo.roomType,
        roomName: event.roomInfo.roomName,
        roomContactPhone: event.roomInfo.roomContactPhone,
        roomContactName: event.roomInfo.roomContactName,
        roomBriefInfo: event.roomInfo.roomBriefInfo
      }
    })
}