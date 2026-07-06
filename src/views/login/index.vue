<script setup>
import { ref } from 'vue'
import { loginApi } from '@/api/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

let loginForm = ref({username:'', password:''})
let router = useRouter()

//登录
const login = async () => {
  const result = await loginApi(loginForm.value)
  if (result.code) {// 登录成功
    ElMessage.success('登录成功')
    localStorage.setItem('loginUser', JSON.stringify(result.data))
    router.push('/')// 跳转
  }else {
    ElMessage.error(result.msg)
  }
}

//取消
const cancel = () => {
  loginForm.value = {
    username: '',
    password: ''
  }
}

</script>

<template>
  <div id="container">
    <div class="login-form">
      <el-form label-width="70px">
        <div class="logo-area">
          <span class="title-brand">Matrix</span>
          <span class="title-sub">智启学习管理系统</span>
        </div>
        
        <el-form-item label="用户名" prop="username" class="form-item">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password" class="form-item">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <div class="btn-group">
          <el-button class="button btn-submit" type="primary" @click="login">登 录</el-button>
          <el-button class="button btn-reset" type="info" @click="cancel">重 置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 全屏居中容器：采用与后台布局呼应的暗色沉稳渐变 */
#container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(135deg, #06253d 0%, #00383a 50%, #095366 100%);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 磨砂玻璃质感登录面板 */
.login-form {
  width: 100%;
  max-width: 420px;
  padding: 40px 35px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 标题样式精准重塑 */
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 35px;
  user-select: none;
}

.title-brand {
  color: #006266; /* 统一沿用品牌主题深绿色 */
  font-size: 32px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
}

.title-sub {
  color: #333333;
  font-size: 24px;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 表单单项间距优化 */
.form-item {
  margin-bottom: 24px !important;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #555555;
}

:deep(.el-input__wrapper) {
  padding: 4px 12px;
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #006266 inset !important; /* 聚焦颜色契合主题 */
}

/* 按钮组与按钮细节美化 */
.btn-group {
  display: flex;
  justify-content: space-between;
  padding-left: 70px; /* 抵消 label 的宽度，使按钮组与输入框对齐 */
  margin-top: 32px;
}

.button {
  height: 38px;
  width: 46%; /* 均分空间 */
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  margin: 0 !important; /* 清除 Element 默认的 margin-left */
}

.btn-submit {
  background-image: linear-gradient(135deg, #006266 0%, #1289a7 100%);
  border: none;
}

.btn-submit:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(18, 137, 167, 0.4);
}

.btn-reset {
  background-color: #f4f4f5;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btn-reset:hover {
  background-color: #e9e9eb !important;
  color: #5b5b5c !important;
  border-color: #c8c9cc;
}
</style>