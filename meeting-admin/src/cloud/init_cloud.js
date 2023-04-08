import "./cloud";

let cloud = window.cloud;
// console.warn("cloudInit");
// console.log(cloud);
let  c1 = new cloud.Cloud({
  // 必填，表示是未登录模式
  identityless: true,
  // 资源方 AppID 填自己的
  resourceAppid: "wx3a4d23f56f37c6f3",
  // 资源方环境 ID	填自己的
  resourceEnv: "meeting-0gpffok549a159d3",
});
//初始化
c1.init();


export default c1