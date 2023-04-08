/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-17 16:56:04
 * @LastEditTime: 2023-03-21 16:46:59
 */

import { MessageBox } from "element-ui";

const install = (Vue, opts = {}) => {
  /* 全局TableHeight */
  Vue.prototype.$baseTableHeight = (formType) => {
    let height = window.innerHeight;
    // let height2 = document.documentElement.clientHeight;

    console.error('定位');
    console.log('windowheight', height);
    // console.log('windowheight',height2);
    let paddingHeight = 400;
    const formHeight = 50;
    let layout = "vertical";

    if (layout === "vertical") {
      paddingHeight = 280;
    }

    if ("number" == typeof formType) {
      height = height - paddingHeight - formHeight * formType;
    } else {
      height = height - paddingHeight;
    }
    return height;
  };

  /* 全局Confirm */
  Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
    MessageBox.confirm(content, title || "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      type: "warning",
    })
      .then(() => {
        if (callback1) {
          callback1();
        }
      })
      .catch((e) => {
        if (callback2) {
          callback2(e);
        }
      });
  };
};

export default install;
