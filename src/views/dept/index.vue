<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryAllApi, addDeptApi, queryInfoApi, updateDeptApi, deleteDeptApi } from '@/api/dept'

// 声明列表展示数据
let tableData = ref([])

// 动态加载数据 - 查询部门
const queryAll = async () => {
  const result = await queryAllApi()
  tableData.value = result.data
}

// 钩子函数
onMounted(() => {
  queryAll()
})

const formTitle = ref('')
//新增部门
const add = () => {
  formTitle.value = '新增部门'
  showDialog.value = true
  deptForm.value = {name: ''}
}

// 编辑部门 - 根据ID查询回显数据
const handleEdit = async (row) => {
  console.log(`Edit item with ID ${row.id}`);
  formTitle.value = '修改部门'
  showDialog.value = true
  deptForm.value = {name: ''}

  const result = await queryInfoApi(row.id)
  if(result.code){
    deptForm.value = result.data
  }
};

// 删除部门 - 根据ID删除部门
const handleDelete = (row) => {
  console.log(`Delete item with ID ${row.id}`);
  //删除部门时, 需要弹出一个确认框, 如果是确认, 则删除部门
  ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 删除部门
    const result = await deleteDeptApi(row.id)
    if(result.code){
      ElMessage.success('删除成功')
      queryAll()
    }
  })
};

// 新增部门对话框的状态
const showDialog = ref(false)
// 表单数据
const deptForm = ref({name: ''})
// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
})

// 表单引用
const deptFormRef = ref(null)

// 重置表单
const resetForm = () => {
  deptFormRef.value.resetFields()
}

// 提交表单
const save = async () => {
  await deptFormRef.value.validate(async valid => {
    if (!valid) return
    // 提交表单
    let result = null;
    if(deptForm.value.id){
      result = await updateDeptApi(deptForm.value) // 修改
    }else {
      result = await addDeptApi(deptForm.value) // 新增
    } 
    if(result.code){
      ElMessage.success('操作成功')
      // 关闭对话框
      showDialog.value = false
      // 重置表单
      resetForm()
      // 重新加载数据
      queryAll()
    }else {
      ElMessage.error(result.msg)
    }
  })
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">部门管理</h2>
      <el-button class="btn-add" type="primary" @click="add()">
        <el-icon><Plus /></el-icon> <span>新增部门</span>
      </el-button>
    </div>

    <el-table 
      :data="tableData" 
      border 
      style="width: 100%; margin-top: 10px;"
      :header-cell-style="{ background: '#f5f7fa', color: '#555555', fontWeight: 'bold' }"
    >
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="300" align="center"/>
      <el-table-column prop="updateTime" label="最后修改时间" width="300" align="center"/>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="{ row }">
          <el-button class="btn-table-edit" size="small" type="primary" plain @click="handleEdit(row)">
            <el-icon><Edit /></el-icon> <span>修改</span>
          </el-button>
          <el-button class="btn-table-delete" size="small" type="danger" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon> <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
      v-model="showDialog" 
      :title="formTitle" 
      width="460px" 
      @close="resetForm"
      class="custom-dialog"
    >
      <el-form :model="deptForm" :rules="formRules" ref="deptFormRef" label-width="90px">
        <el-form-item label="部门名称" prop="name" class="dialog-form-item">
          <el-input v-model="deptForm.name" autocomplete="off" placeholder="请输入2-10位部门名称" clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-dialog-cancel" @click="showDialog = false">取 消</el-button>
          <el-button class="btn-dialog-save" type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 整个局部内容区域 */
.page-container {
  padding: 4px;
}

/* 规范的 Flexbox 顶栏 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #333333;
  font-weight: 700;
  position: relative;
  padding-left: 10px;
}

/* 在标题左侧加一条精美的品牌色小竖线 */
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

/* 契合大框架的渐变新增按钮 */
.btn-add {
  background-image: linear-gradient(135deg, #006266 0%, #1289a7 100%);
  border: none;
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.btn-add:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(18, 137, 167, 0.3);
}

/* 表格内微型功能按钮深度调优 */
.btn-table-edit {
  border-color: #1289a7;
  color: #1289a7;
  font-weight: 600;
}

.btn-table-edit:hover {
  background-color: #1289a7 !important;
  color: #ffffff !important;
  border-color: #1289a7 !important;
}

.btn-table-delete {
  font-weight: 600;
}

/* 利用深度选择器穿透组件内部样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.el-table__header-wrapper th) {
  border-bottom: 2px solid #e6f7ff !important;
}

/* 对话框扁平圆角微调 */
:deep(.el-dialog.custom-dialog) {
  border-radius: 10px;
  overflow: hidden;
  padding: 25px;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  color: #333333;
}

.dialog-form-item {
  margin: 15px 0 5px 0;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #006266 inset !important; /* 输入框聚焦联动品牌色 */
}

/* 弹窗底部操作按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-dialog-cancel {
  border-radius: 6px;
}

.btn-dialog-save {
  background-image: linear-gradient(135deg, #006266 0%, #1289a7 100%);
  border: none;
  border-radius: 6px;
  font-weight: 600;
}

.btn-dialog-save:hover {
  opacity: 0.9;
}
</style>