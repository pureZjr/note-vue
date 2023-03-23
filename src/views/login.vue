<template>
  <div
    class="container"
    :class="{ handleLogin: handleLogin, handleRegister: !handleLogin }"
  >
    <div
      class="bgImgs"
      :style="{
        'background-image': `url(${bgImg})`,
      }"
    >
      <img
        :src="bgSmall"
        :style="{
          opacity: Number(!bgImg),
        }"
      />
      <div class="bgImgsMask"></div>
    </div>
    <div class="wrapperMask" />
    <div class="formWrapper">
      <h1>{{ handleLogin ? '欢迎回来' : '立即注册' }}</h1>
      <div class="form}">
        <div v-if="!handleLogin" class="item">
          <label>昵称</label>
          <ElInput v-model="formData.username" />
        </div>
        <div class="item">
          <label>邮箱</label>
          <ElInput v-model="formData.email" />
        </div>
        <div class="item">
          <label>密码</label>
          <ElInput
            type="password"
            v-model="formData.password"
            @keyup.enter="onEnter"
          />
        </div>
        <div v-if="!handleLogin" class="item">
          <label>确认密码</label>
          <ElInput
            type="password"
            v-model="formData.insure"
            @keyup.enter="onEnter"
          />
        </div>
      </div>
      <ElButton
        type="primary"
        shape="round"
        :loading="loading"
        class="submit"
        @click="submit"
      >
        {{ handleLogin ? '登录' : '注册' }}
      </ElButton>
    </div>
    <div class="subCount">
      <div class="subCountWrap">
        <div class="desc">
          <h2>{{ handleLogin ? '还没注册?' : '已有帐号？' }}</h2>
          <span>{{
            handleLogin
              ? '立即注册体验一下吧！'
              : '有帐号就登录吧，好久不见了！'
          }}</span>
        </div>
        <div class="btn" @click="tigger">
          <div class="{loginBtn: handleLogin , registerBtn: !handleLogin}">
            <div>注册</div>
            <div>登录</div>
          </div>
        </div>
        <img :src="codeMaker" width="900" height="550" />
        <div class="mask" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElButton, ElInput } from 'element-plus'

import { LOCALSTORAGE, QN_SOURCE_URL } from '@/constant/index'
import { login, register } from '@/services/api/account'
import _userInfoStore from '@/store/userInfo/index'

const handleLogin = ref(true)
const bgImg = ref('')
const loading = ref(false)

const formData = reactive({
  email: '',
  username: '',
  password: '',
  insure: '',
})

const bgSmall = `${QN_SOURCE_URL}/note/bg-small.png`
const codeMaker = `${QN_SOURCE_URL}/note/code-maker.gif`

const router = useRouter()
const userInfoStore = _userInfoStore()

const tigger = () => {
  handleLogin.value = !handleLogin.value
  formData.email = ''
  formData.insure = ''
  formData.password = ''
  formData.username = ''
}

const onEnter = () => {
  submit()
}

const submit = async () => {
  const reg =
    /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
  if (!reg.test(formData.email)) {
    return ElMessage.warning('请确保邮箱正确')
  }

  if (handleLogin.value) {
    try {
      if (!formData.email || !formData.password) {
        return ElMessage.warning('请确保输入完整')
      }
      loading.value = true
      const res = await login({
        email: formData.email,
        password: formData.password,
      })
      localStorage.setItem(LOCALSTORAGE.USERINFO, JSON.stringify(res))
      userInfoStore.setUserInfo(res)
      router.push('/')
    } catch (err) {
      loading.value = false
      console.error(err)
    }
  } else {
    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.insure
    ) {
      return ElMessage.warning('请确保输入完整')
    }
    if (formData.password !== formData.insure) {
      return ElMessage.warning('两次密码不一致，请重新输入')
    }
    loading.value = true
    try {
      await register(formData)
      tigger()
      ElMessage.success('注册成功，赶紧登录体验吧！')
    } catch {}
    loading.value = false
  }
}

const loadBg = () => {
  const img = new Image()
  img.src = `${QN_SOURCE_URL}/note/bg.png`
  img.onload = () => {
    bgImg.value = img.src
  }
}

onMounted(() => {
  if (localStorage.getItem(LOCALSTORAGE.USERINFO)) {
    router.push('/')
  } else {
    loadBg()
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';

@mixin mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: $black01;
}

.bgImgs {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;

  img {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transition: opacity 0.8s;
  }
}

.bgImgsMask {
  @include mask;
}

.formWrapper {
  position: absolute;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 550px;
  overflow: hidden;
  background: #fff;
  transition: left 0.5s;
  transition: left 0.6s ease-in-out;

  h1 {
    margin: 50px 0 25px;
  }
}

.wrapperMask {
  @include mask;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  padding: 0 5px 5px;
  margin-top: 25px;
  color: $black04;

  label {
    margin-bottom: 5px;
    font-size: 12px;
    color: $color-gray;
  }

  input {
    width: 260px;
    text-align: center;
    background-color: #fff;
    border: 0;
    box-shadow: unset !important;

    &:-internal-autofill-selected {
      background-color: #fff !important;
      border: 0px !important;
      box-shadow: 0 0 0px 1000px white inset !important;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: color 11111s ease-out, background-color 111111s ease-out;
    transition-delay: 111111s;
  }
}

.loginContainer {
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  :global(.ant-form-item-label > label) {
    color: $black08;
  }
}

.subCount {
  position: absolute;
  top: 0;
  z-index: 2;
  width: 260px;
  height: 550px;
  overflow: hidden;
  transition: right 0.6s ease-in-out;

  .subCountWrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 550px;
    overflow: hidden;
    color: #fff;
  }

  * {
    z-index: 2;
  }

  h2 {
    margin-bottom: 10px;
    font-size: 26px;
    color: #fff;
    text-align: center;
  }

  .desc {
    margin-top: 50px;
  }

  img {
    position: absolute;
    top: 0;
    z-index: 1;
    transition: left 0.6s ease-in-out;
  }

  .btn {
    position: relative;
    width: 100px;
    height: 30px;
    margin-bottom: 150px;
    overflow: hidden;
    line-height: 30px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    border: 1px solid #fff;
    border-radius: 16px;

    > div {
      position: absolute;
      left: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 60px;
      transition: top 0.6s ease-in-out;

      > div {
        left: 0;
        width: 100%;
        min-height: 30px;
        line-height: 27px;
      }
    }
  }

  .loginBtn {
    top: 0;
  }
  .registerBtn {
    top: -30px;
  }

  .mask {
    @include mask;
  }
}

.bg {
  z-index: 1;
  width: 760px;
  height: 550px;
  padding: 1px;
}

.submit {
  width: 260px;
  margin: 40px 0 20px;
}

.handleLogin {
  .formWrapper {
    top: 50%;
    left: calc(50% - 380px);
    transform: translateY(-50%);
  }

  .subCount {
    top: 50%;
    right: calc(50% - 380px);
    transform: translateY(-50%);

    img {
      left: -500px;
    }
  }
}

.handleRegister {
  .formWrapper {
    top: 50%;
    left: calc(50% - 120px);
    transform: translateY(-50%);
  }

  .subCount {
    top: 50%;
    right: calc(50% + 120px);
    transform: translateY(-50%);

    img {
      left: 0px;
    }
  }
}
</style>
