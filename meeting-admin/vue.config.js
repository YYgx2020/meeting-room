const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig()
module.exports = {
  transpileDependencies: true,
  lintOnSave: false,  // 关闭 eslint 提示
  outputDir: 'dist',  // 打包文件夹
  devServer: {
    // allowedHosts: [
    //   'http://yghomeapi.lianghongyi.com/',
    // ],
    // disableHostCheck: true,  // 开发阶段，跳过 host 检查，实现内网穿透 webpack5 已经废弃
    historyApiFallback: true,
    allowedHosts: "all",
    host: '127.0.0.1',
    port: '8080',
    proxy: { // 配置跨域
      '/api': {
        target: 'https://api.weixin.qq.com',   //请求接口域名  
        ws: true,
        // secure: false,
        changOrigin: true,    //是否允许跨越
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
}
