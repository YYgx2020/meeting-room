/*
 * @Author: liangminqiang
 * @Description: 
 * @Date: 2023-03-17 16:56:04
 * @LastEditTime: 2023-03-17 18:02:55
 */

const install = (Vue, opts = {}) => {


  /* 全局TableHeight */
  Vue.prototype.$baseTableHeight = (formType) => {
    let height = window.innerHeight
    let height2 = document.documentElement.clientHeight
    

    console.error('定位');
    console.log('windowheight', height);
    console.log('windowheight',height2);
    let paddingHeight = 400
    const formHeight = 50
    let layout = 'vertical'

    if (layout === 'vertical') {
      paddingHeight = 100
    }

    if ('number' == typeof formType) {
      height = height - paddingHeight - formHeight * formType
    } else {
      height = height - paddingHeight
    }
    return height
  }
}

export default install
