// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 使用云调用生成对应页面的小程序码
    const result = await cloud.openapi.wxacode.get({
      path: event.path, // 指定页面，并携带参数
      width: 430, // 设置二维码图片的大小
    })
    // 把生成的小程序码保存到云存储
    const upload = await cloud.uploadFile({
      cloudPath: 'roomQrcode/' + event.name + '.png',
      fileContent: result.buffer
    })
    return upload;
  } catch (err) {
    console.log(err);
    return err;
  }
}