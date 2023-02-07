// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  console.log(context);
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
      env: '',//在云开发控制台中的环境ID
      content: '您的预约申请未能通过，请前往【约一约】小程序查看详情', //短信内容
      phoneNumberList: [
        "+86" + event.name,   //要发送的手机号码，我这是方法中传过来的号码，可以先写死测试
      ]
    })
    return result;
  } catch (err) {
    return err;
  }
}