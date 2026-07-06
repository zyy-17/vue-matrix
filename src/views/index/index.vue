<script setup>
import homeBgImg from '@/assets/index.png'
</script>

<template>
  <div class="welcome-container">
    <!-- 将大图包裹在符合 Matrix 主题的居中卡片容器中 -->
    <div class="image-wrapper">
      <img :src="homeBgImg" alt="Matrix 教学后台" class="home-illustration" />
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
  background-color: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 20px;
}

.image-wrapper {
  width: 100%;
  max-width: 960px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

/* 首页插画自适应优化 */
.home-illustration {
  width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  pointer-events: none; 
}
</style>