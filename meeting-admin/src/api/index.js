/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-16 21:54:04
 */

import axios from "../utils/request";
import Cookies from "js-cookie";
import { env } from "@/utils/constant";
import c1 from "@/cloud/init_cloud";

// 从 cookie 中获取 access_token
const access_token = Cookies.get("access_token");

// 获取 access_token
/* 
  data: {
    // 详情见微信小程序官方文档：
    https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
    grant_type,  // 一个常量字符串
    appid,  // 小程序的 APPID
    secret,  // 小程序的密钥
  }
*/
export function getAccessToken(data) {
  return axios({
    url: "/cgi-bin/token",
    method: "get",
    params: data,
  });
}

// 登录验证
/**
 * @name 登录验证
 * @param { string } access_token
 * @param { string } phone
 * @param { string } password
 * @return { axios }
 */

export function loginAuth(access_token, phone, password) {
  // console.log("查看", access_token, phone, password);
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection(\"adminInfo\").where({phone: '${phone}', password: '${password}'}).get()`,
    },
  });
}

export function getRoomInfo() {
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection(\"roomInfo\").get()`,
    },
  });
}
// cloud.database().collection('roomInfo')
//   .get()
export function getScount() {
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection(\"studentInfo\").count()`,
    },
  });
}

export function getTcount() {
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection(\"teacherInfo\").count()`,
    },
  });
}

export function getUserAppointInfo() {
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection(\"userAppointInfo\").get()`,
    },
  });
}

// export function getRoomInfo() {
//   return axios({
//     url: `/tcb/databasequery?access_token=${access_token}`,
//     method: 'post',
//     data: {
//       env,
//       query: `db.collection(\"roomInfo\").get()`,
//     }
//   })
export function getRoomAppointInfo(time) {
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: "post",
    data: {
      env,
      query: `db.collection('roomAppointInfo')
      .where({
        date: ${time},
      })
      .get()`,
    },
  });
}
export function updateUserInfo(event) {
  return c1.callFunction({
    name: "UpdateUserInfo",
    data: {
      sheetName: event.sheetName,
      openid: event.openid,
      isProve: event.isProve,
    },
  });
}

// export function uploadCoverImg(event){

// }
export function delRoomInfoItem(event) {
  
  return c1.callFunction({
    name: "delRoomInfoItem",
    data: {
      roomid: event.roomid,
    },
  });
}
export async function uploadCoverImg(event) {
  let timestamp = new Date().getTime();
  console.log("time", timestamp);
  console.log(event.tempFilePaths);
  try {
    let res1 = await c1.callFunction({
      name: "uploadCoverImg",
      data: {
        cloudPath: "roomCoverImage/" + timestamp + ".png",
        // 指定要上传的文件的小程序临时文件路径
        filePath: event.tempFilePaths,
      },
    });

    console.log("res1",res1);
    return c1.callFunction({
      name: "getCoverImagePath",
      data: {
        fileList: [
          {
            fileID: res1.fileID,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export function addRoomInfo(event) {
  return c1.callFunction({
    name: "addRoomInfo",
    data: event
  });
}

  export function updateRoomInfo(event) {
    return c1.callFunction({
      name: "updateRoomInfo",
      data: event
    })
  }
  export function getRoomInfoByTimeID(event) {
    // console.log("event",event.roomid,event.time);
    return c1.callFunction({
      name: "getRoomInfoByTimeID",
      data: 
      {
        roomid: event.roomid,
        date: event.time
      }
    })
  }
  export function updateRoomAppointInfo2(event) {
    console.log("eeeeee31231");
    console.log("updateRoomAppointInfo2",event.roomid,event.time,event.appointArr);
    return c1.callFunction({
      name: "updateRoomAppointInfo2",
      data: 
      {
        roomid: event.roomid,
        time: event.time,
        appointArr: event.appointArr
      }
    })
  }
  export function updateUserAppointInfo2(event) {
    console.log("updateUserAppointInfo2",event.openid,event.createTime,event.isAgree,event.rejectReason);
    return c1.callFunction({
      name: "updateUserAppointInfo2",
      data: 
      {
        openid: event.openid,
        createTime: event.createTime,
        isAgree: event.isAgree,
        rejectReason:event.rejectReason
      }
    })
  }
  