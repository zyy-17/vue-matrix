<script setup>
import { onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { queryStudentCountDataApi, queryEmpGenderDataApi, queryStudentDegreeDataApi } from '@/api/report'

// 定义两个全局变量用来存放图表实例，方便在生命周期结束时销毁
let studentCountChartInstance = null;
let degreeChartInstance = null;

// 钩子函数 - 加载报表
onMounted(() => {
  nextTick(() => {
    loadStudentCountChart() // 加载班级人数报表
    loadDegreeChart()       // 加载学历统计报表
  })
})

// 【完善修改】当用户切换到其他菜单、组件卸载时，主动释放图表资源，防止内存泄漏和DOM冲突
onUnmounted(() => {
  if (studentCountChartInstance) {
    studentCountChartInstance.dispose();
    studentCountChartInstance = null;
  }
  if (degreeChartInstance) {
    degreeChartInstance.dispose();
    degreeChartInstance = null;
  }
})

// 获取职位统计报表
const loadStudentCountChart = async () => {
  let result = await queryStudentCountDataApi();
  let clazzList = result.data.clazzList;
  let dataList = result.data.dataList;

  initStudentCountChart(clazzList, dataList)
}

// 获取性别统计报表
const loadDegreeChart = async () => {
  let result = await queryStudentDegreeDataApi();
  initDegreeChart(result.data)
}

// 班级人数统计报表
function initStudentCountChart(clazzList, dataList) {
  // 基于准备好的dom，初始化echarts实例
  const chartDom = document.getElementById('container1');
  
  // 💡【核心功能完善】：重新进入时，先检查该 DOM 上是否已存在旧的 ECharts 实例，如果有，先销毁它
  const existingChart = echarts.getInstanceByDom(chartDom);
  if (existingChart) {
    existingChart.dispose();
  }

  var myChart = echarts.init(chartDom);
  studentCountChartInstance = myChart; // 赋给全局变量，便于离开页面时统一销毁

  // 绘制图表
  myChart.setOption({
    title: {
      text: '班级人数统计',
      subText: '',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333'
      },
      left: 'center',
      top: '10'
    },
    grid:{
      left: '6%',
      right: '6%',
      bottom: '8%',
      top: '22%',
      containLabel:true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow' // 悬停阴影效果
      }
    },
    xAxis: {
      data: clazzList,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#bfbfbf' } },
      axisLabel: { color: '#666666' }
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#e8e8e8' } } // 虚线网格线
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        barWidth: '40%', // 优化柱体宽度
        data: dataList,
        itemStyle:{
          // 【重构】设置联动 Matrix 主题的蓝绿科技感柱状渐变色
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#1289a7' // 科技蓝
            },
            {
              offset: 1,
              color: '#006266' // 品牌深青绿
            }
          ]),
          borderRadius: [4, 4, 0, 0] // 柱子顶部微圆角
        }
      }
    ]
  });
}

function initDegreeChart(degreeDataList) {
  // 基于准备好的dom，初始化echarts实例
  const chartDom = document.getElementById('container2');
  
  // 💡【核心功能完善】：重新进入时，先检查该 DOM 上是否已存在旧的 ECharts 实例，如果有，先销毁它
  const existingChart = echarts.getInstanceByDom(chartDom);
  if (existingChart) {
    existingChart.dispose();
  }

  var myChart = echarts.init(chartDom);
  degreeChartInstance = myChart; // 赋给全局变量，便于离开页面时统一销毁

  let option = {
    // 【重构】定义多梯度高档色盘，适配学员各层次学历统计
    color: ['#006266', '#1289a7', '#a8eb12', '#7bed9f', '#2ed573', '#1e90ff'],
    title: {
      text: '学员学历统计',
      subText: '',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333'
      },
      left: 'center',
      top: '10'
    },
    grid:{
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel:true
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}人 ({d}%)'
    },
    legend: {
      top: '15%',
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#666666' }
    },
    series: [
      {
        name: '学历分布',
        type: 'pie',
        radius: ['42%', '68%'],
        avoidLabelOverlap: false,
        top: '18%',
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#006266'
          }
        },
        data: degreeDataList
      }
    ]
  };
  // 绘制图表
  myChart.setOption(option);
}

</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">数据统计管理</h2>
    </div>

    <div class="charts-wrapper">
      <div class="chart-card">
        <div class="report_container" id="container1"></div>
      </div>

      <div class="chart-card">
        <div class="report_container" id="container2"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整个局部内容页容器 */
.page-container {
  padding: 4px;
}

/* 统一小竖线标题顶栏 */
.page-header {
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f2f5;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #333333;
  font-weight: 700;
  position: relative;
  padding-left: 10px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 4px;
  height: 18px;
  background-color: #006266;
  border-radius: 2px;
}

/* 摒弃 float，改用弹性盒进行双卡片流对称并排 */
.charts-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: calc(100vh - 170px); /* 动态适配高度，防止在布局框架内挤压变窄 */
  min-height: 460px;
}

/* 独立的白色高档衬底卡片 */
.chart-card {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  padding: 16px;
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s;
}

.chart-card:hover {
  transform: translateY(-4px); /* 悬停微浮动动效 */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* 精准图表DOM载体 */
.report_container {
  width: 100%;
  height: 100%;
}
</style>