<script setup>
import { onMounted, ref } from 'vue'
import { queryPageApi} from '@/api/log'

//列表展示数据
let tableData = ref([])

//钩子函数 - 页面加载时触发
onMounted(() => {
  queryPage()
})

//分页组件
const pagination = ref({currentPage: 1, pageSize: 15, total: 0})
//每页展示记录数发生变化时触发
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  queryPage()
}
//当前页码发生变化时触发
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

//分页条件查询
const queryPage = async () => {
  const result = await queryPageApi(pagination.value.currentPage,pagination.value.pageSize);

  if(result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">日志管理</h2>
    </div>
    
    <el-table 
      :data="tableData" 
      border 
      style="width: 100%" 
      fit 
      size="small"
      :header-cell-style="{ background: '#f5f7fa', color: '#555555', fontWeight: 'bold' }"
    >
      <el-table-column prop="operateEmpName" label="操作人" align="center" width="90px"/>
      <el-table-column prop="operateTime" label="操作时间" align="center" width="160px"/>
      <el-table-column prop="className" label="类名" align="center" width="280px" />
      <el-table-column prop="methodName" label="方法名" align="center" width="120px" />
      <el-table-column prop="costTime" label="操作耗时(ms)" align="center" width="110px">
        <template #default="scope">
          <span :class="['cost-time-text', scope.row.costTime > 500 ? 'warning-time' : '']">
            {{ scope.row.costTime }} ms
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="methodParams" label="请求参数" align="center" width="280px">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" popper-style="font-size:12px; max-width:400px; word-break:break-all;">
            <template #default>
              <div class="popover-content">参数详情: {{ scope.row.methodParams }}</div>
            </template>
            <template #reference>
              <el-tag class="param-tag" v-if="scope.row.methodParams.length <= 30" size="small">
                {{ scope.row.methodParams }}
              </el-tag>
              <el-tag class="param-tag" v-else size="small">
                {{ scope.row.methodParams.substring(0,30) + '...' }}
              </el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="returnValue" label="返回值" align="center"></el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* 页面基础容器 */
.page-container {
  padding: 4px;
}

/* 顶模块统一小竖线标题 */
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

/* 耗时高亮样式微调 */
.cost-time-text {
  font-weight: 600;
  color: #2f3542;
}

.warning-time {
  color: #ff4d4f !important; /* 耗时过长标红提示 */
}

/* 请求参数标签高级调色 */
.param-tag {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #006266;
  font-family: Consolas, Monaco, monospace; /* 改用等宽字体展示参数更具极客风 */
  cursor: pointer;
}

.popover-content {
  color: #333333;
  line-height: 1.5;
}

/* 分页区外联间距靠右对齐 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 4px;
}

/* 深度组件样式穿透穿入 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

:deep(.el-table__header-wrapper th) {
  border-bottom: 2px solid #e6f7ff !important;
}

/* 紧凑型小表格横向单元格线微调 */
:deep(.el-table--small .el-table__cell) {
  padding: 8px 0;
}

/* 弹出框及分页聚焦联动 */
:deep(.el-pagination .el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #006266 inset !important;
}
</style>