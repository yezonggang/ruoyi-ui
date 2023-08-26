<template>
  <el-container class="logindiv">
    <el-main class="box">
      <div class="childrenBox infobox">
        <div class="descbox">
          <div style="font-family: fantasy">
            <div class="label-container" style="width: 65%; height: 30px">
              <img
                src="../assets/login/sz.png"
                alt=""
                style="width: 35px; height: 35px; margin-left: 10px"
              />
              <div style="font-size: 1.614rem"><br />施工管理系统</div>
            </div>
            <br />
            <div style="margin-left: 10px; font-size: 20px; margin-top: 20px">
              一个方便的信息化系统
            </div>
            <div style="margin-left: 10px; margin-top: 40px; font-size: 16px">
              施工监测后台管理系统，掌握项目进度与问题
            </div>
          </div>
        </div>
      </div>
      <div class="childrenBox formbox">
        <div class="lognbox">
          <h1 class="formname">登录</h1>
          <el-form
            style="margin-top: 80px"
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                size="large"
                v-model="loginForm.username"
                placeholder="账号"
                ref="username"
                name="username"
                tabindex="1"
                autocomplete="on"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              ></el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="validCode"
                  class="el-input__icon input-icon"
                />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-checkbox style="color: #d3dce6">记住我</el-checkbox>
            </el-col>
            <el-col :span="17">
              <div style="float: right">
                <el-link type="info" style="color: #d3dce6">忘记密码</el-link>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px">
            <el-button
              type="warning"
              style="width: 350px"
              @click.native.prevent="handleLogin"
              >登录</el-button
            >
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { validUsername } from "@/utils/validate";
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin@123",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      captchaEnabled: true,
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 10%;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 10%;
}

.el-main {
  line-height: 80%;
}

.box {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
}

.childrenBox {
  width: 500px;
  height: 500px;
  box-shadow: 2px 2px 10px #909090; /*opera或ie9*/
}

.infobox {
  background: no-repeat url("../assets/login/descbg.jpg");
  color: #333;
  justify-content: center;
  align-items: center;
  display: flex;
}

.formbox {
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: #eee0e0;
  justify-content: center;
  align-items: center;
  display: flex;
}

.lognbox {
  width: 350px;
  height: 414px;
  color: #eee0e0;
}

.descbox {
  width: 350px;
  height: 414px;
  color: #eee0e0;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.descbox h1 h2 span {
  color: #f3eded;
}

.formname {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Liberation Sans",
    "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Wenquanyi Micro Hei",
    "WenQuanYi Zen Hei", "ST Heiti", SimHei, SimSun, "WenQuanYi Zen Hei Sharp",
    sans-serif;
  line-height: 1.33em;
  margin: calc(2rem - 0.165em) 0em 1rem;
  font-weight: bold;
  float: left;
}

.logindiv {
  background: no-repeat url("../assets/login/login_background.jpg");
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
.login-code {
  width: 33%;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.label-container {
  width: auto;
  display: flex;
}
</style>
