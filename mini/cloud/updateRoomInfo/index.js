// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  return cloud.database().collection('roomInfo')
    .where({
      roomid: event.roomid * 1,
    })
    .update({
      data: {
        roomCoverImg: event.roomCoverImg,
        fileID: event.fileID,
        roomPeople: event.roomPeople,
        roomType: event.roomType,
        roomName: event.roomName,
        roomContactPhone: event.roomContactPhone,
        roomContactName: event.roomContactName,
        roomBriefInfo: event.roomBriefInfo
      }
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
}