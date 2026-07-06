<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router'

let router = useRouter()

const loginName = ref('')
//定义钩子函数, 获取登录用户名
onMounted(() => {
  //获取登录用户名
  let loginUser = JSON.parse(localStorage.getItem('loginUser'))
  if (loginUser) {
    loginName.value = loginUser.name
  }
})

const logout = () => {
  //弹出确认框, 如果确认, 则退出登录, 跳转到登录页面
  ElMessageBox.confirm('确认退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {//确认, 则清空登录信息
    ElMessage.success('退出登录成功')
    localStorage.removeItem('loginUser')
    router.push('/login')//跳转到登录页面
  })
}
</script>

<template>
  <div class="common-layout">
    <el-container class="app-container">
      <el-header class="header">
        <div class="logo-area">
          <span class="title-brand">Matrix</span>
          <span class="title-sub">智启学习管理系统</span>
        </div>
        <span class="right_tool">
          <a href="" class="nav-link">
            <el-icon><EditPen /></el-icon> <span>修改密码</span>
          </a>
          <span class="divider">|</span>
          <a href="javascript:void(0)" @click="logout" class="nav-link logout-btn">
            <el-icon><SwitchButton /></el-icon> <span>退出登录 【{{ loginName }}】</span>
          </a>
        </span>
      </el-header>
      
      <el-container class="main-container">
        <el-aside width="240px" class="aside">
          <el-menu router default-active="/index" class="custom-menu">
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon>
              <span>首页</span>
            </el-menu-item>
            
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>班级学员管理</span>
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>
                <span>班级管理</span>
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon><UserFilled /></el-icon>
                <span>学员管理</span>
              </el-menu-item>
            </el-sub-menu>
            
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="/dept">
                <el-icon><HelpFilled /></el-icon>
                <span>部门管理</span>
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon><Avatar /></el-icon>
                <span>员工管理</span>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/report">
              <template #title>
                <el-icon><Histogram /></el-icon>
                <span>数据统计管理</span>
              </template>
              <el-menu-item index="/report/emp">
                <el-icon><InfoFilled /></el-icon>
                <span>员工信息统计</span>
              </el-menu-item>
              <el-menu-item index="/report/stu">
                <el-icon><Share /></el-icon>
                <span>学员信息统计</span>
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><Document /></el-icon>
                <span>日志信息统计</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <el-main class="main-content">
          <div class="content-card">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 让全屏高度撑满，避免生硬的固定像素高度 */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航条重构：沉稳大气的科技感渐变 */
.header {
  background-image: linear-gradient(135deg, #0a3d62 0%, #006266 50%, #1289a7 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  height: 64px !important;
}

/* 标题样式美化 */
.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-brand {
  color: #a8eb12; /* 高亮科技绿 */
  font-size: 28px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.title-sub {
  color: #ffffff;
  font-size: 22px;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 右侧工具栏联动 */
.right_tool {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  padding: 6px 10px;
  border-radius: 4px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn:hover {
  color: #ff7875; /* 悬停退出呈现警告微红 */
  background-color: rgba(255, 120, 117, 0.1);
}

.divider {
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  user-select: none;
}

/* 主体布局控制 */
.main-container {
  flex: 1;
  overflow: hidden;
}

/* 侧边栏及菜单重塑 */
.aside {
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  height: 100%;
}

.custom-menu {
  border-right: none !important;
  height: 100%;
  padding-top: 8px;
}

/* 通过深度选择器重塑 Element Plus 菜单的高亮体验 */
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 6px;
  color: #4a4a4a;
}

:deep(.el-sub-menu__title) {
  margin: 4px 8px;
  border-radius: 6px;
  color: #4a4a4a;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f7ff !important;
  color: #006266 !important;
  font-weight: bold;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
}

/* 右侧工作展区：卡片化衬底，让内嵌视图更美观 */
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.content-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  min-height: calc(100% - 48px);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>