<template>
  <div id="Login">
    <!-- logo -->
    <div class="logo">
      <img src="../../assets/img/guet_logo.png" alt="" />
    </div>
    <!-- 标题 -->
    <div class="login_panel">
      <h1>会议室预约管理系统</h1>
      <div class="login_box">
        <h3>欢迎登录</h3>
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
          :rules="rules"
          ref="formLabelAlign"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formLabelAlign.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="formLabelAlign.password"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-link :underline="false">忘记密码？</el-link>
        </el-row>
        <el-button type="primary" round @click="loginEvent('formLabelAlign')"
          >登录</el-button
        >
      </div>
    </div>
    <!-- 背景轮播图 -->
    <el-carousel indicator-position="none" height="100vh" arrow="never">
      <el-carousel-item v-for="(item, index) in cover" :key="index">
        <img :src="item" alt="" />
        <!-- <img src="../../assets/img/1.jpg" alt=""> -->
      </el-carousel-item>
    </el-carousel>
    <div class="inner-header flex">
      <!-- <h1>简单的 CSS3 波浪效果</h1> -->
    </div>
    <!-- 主登录窗口 -->
    <div>
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            fill="rgba(255,255,255,0.7"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            fill="rgba(255,255,255,0.5)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            fill="rgba(255,255,255,0.3)"
          />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
import { getAccessToken, loginAuth } from '@/api';
import { grant_type, appid, secret } from '../../utils/constant.js';
import Cookie from 'js-cookie';

export default {
  name: 'Login',

  data() {
    return {
      cover: [
        require('../../assets/img/1.jpg'),
        require('../../assets/img/2.jpg'),
        require('../../assets/img/3.jpg'),
        require('../../assets/img/4.jpg'),
        require('../../assets/img/5.jpg'),
      ],
      labelPosition: 'left',
      formLabelAlign: {
        phone: '',
        password: '',
      },
      rules: {
        phone: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur',
          },
          {
            min: 11,
            max: 11,
            message: '请输入11位手机号码',
            trigger: 'blur',
          },
          {
            pattern:
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  created() {},

  methods: {
    /* 
      管理员登录机制：
      每次登录时都去发一次请求获取 access_token，然后存入 cookie 中，时间间隔为 2 小时
    */
    loginEvent(formLabelAlign) {
      console.log('测试自动化部署是否成功');
      console.log('点击了登录按钮');
      this.$refs[formLabelAlign].validate((valid) => {
        console.log(valid);
        if (valid) {
          // alert('submit!');
          console.log('发送请求获取access_token');
          console.log(grant_type);
          const data = {
            grant_type,
            appid,
            secret,
          };
          getAccessToken(data).then((res) => {
            console.log('res: ', res);
            const access_token = res.data.access_token;
            // 设置两小时失效
            const time = new Date(new Date() * 1 + 2 * 60 * 60 * 1000);
            Cookie.set('access_token', access_token, { expires: time });
            // 再发一次请求去登录
            console.log('formLabelAlign: ', this.formLabelAlign);
            const { phone, password } = this.formLabelAlign;
            // return;
            loginAuth(access_token, phone, password).then((res2) => {
              console.log(res2);
              if (res2.data.data) {
                this.$message({
                  message: '登录成功',
                  type: 'success',
                });
                // 管理员用户存在，登录成功
                const adminInfo = JSON.parse(res2.data.data[0]);
                // 将用户信息存入 cookie 中
                console.log(adminInfo);
                Cookie.set('adminInfo', JSON.stringify(adminInfo));
                // 跳转到首页
                this.$router.replace({
                  name: 'home',
                });
              } else {
                this.$message.error('登录错误，请检查登录信息');
              }
            });
          });
          // testApi();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
@import url('@/assets/css/login.less');
</style>
