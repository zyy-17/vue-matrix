<script setup>
import { onMounted, ref, watch } from 'vue'
import { queryPageApi , addApi, queryInfoApi, updateApi, deleteApi} from '@/api/clazz'
import { queryAllApi as queryAllEmpApi } from '@/api/emp'
import { ElMessage, ElMessageBox } from 'element-plus'

//学科列表数据
const subjects = ref([{ name: 'Java', value: 1 },{ name: '前端', value: 2 },{ name: '大数据', value: 3 },{ name: 'Python', value: 4 },{ name: 'Go', value: 5 },{ name: '嵌入式', value: 6 }])
//搜索表单对象
let searchClazz = ref({begin:'', end:'', date:[], name:''})
//列表展示数据
let tableData = ref([])

//钩子函数 - 页面加载时触发
onMounted(() => {
  queryPage()
  queryAllEmp()
})

//所有的员工数据
let emps = ref([])
//加载所有的员工数据
const queryAllEmp = async () => {
  let result = await queryAllEmpApi()
  if(result.code) {
    emps.value = result.data
  }
}

//分页组件
const pagination = ref({currentPage: 1, pageSize: 10, total: 0})
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
  const result = await queryPageApi(
      searchClazz.value.begin,
      searchClazz.value.end,
      searchClazz.value.name,
      pagination.value.currentPage,
      pagination.value.pageSize
  );

  if(result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  }
}

//清空搜索栏
const clear = () => {
  searchClazz.value = {begin:'', end:'', date:[], name:''}
  queryPage()
}

//监听searchEmp的date属性
watch(() => searchClazz.value.date, (newVal, oldVal) => {
  console.log(`newVal : ${newVal} ; oldVal: ${oldVal} `)
  if(newVal.length > 0) {
    console.log('-----------');
    searchClazz.value.begin = newVal[0]
    searchClazz.value.end = newVal[1]
  }else {
    console.log('==========');
    searchClazz.value.begin = ''
    searchClazz.value.end = ''
  }
})



//----------- 新增 / 修改 ---------------------------
let dialogFormVisible = ref(false) //控制新增/修改的对话框的显示与隐藏
let labelWidth = ref(80) //form表单label的宽度
let formTitle = ref('') //表单的标题
//员工对象-表单数据绑定
let clazz = ref({
  id: '',
  name: '',
  room: '',
  beginDate: '',
  endDate: '',
  subject: '',
  masterId: ''
})

//清空表单
const clearClazz = () => {
  clazz.value = {
    id: '',
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    subject: '',
    masterId: ''
  }
}

//新增班级
const addClazz = () => {
  dialogFormVisible.value = true
  formTitle.value = '新增班级'
  clearClazz()
}

//修改班级
const updateClazz = async (id) => {
  clearClazz()
  dialogFormVisible.value = true
  let result = await queryInfoApi(id)
  if(result.code){
    clazz.value = result.data
  }
}

//表单校验规则
const clazzFormRef = ref()
const rules = ref({
  name: [
    { required: true, message: '班级名称为必填项', trigger: 'blur' },
    { min: 4, max: 30, message: '用户名长度为4-30个字', trigger: 'blur' }
  ],
  room: [
    { min: 1, max: 20, message: '班级教室长度为1-20个字', trigger: 'blur' }
  ],
  beginDate: [{ required: true, message: '开课时间为必填项', trigger: 'change' }],
  endDate: [{ required: true, message: '结课时间为必填项', trigger: 'change' }],
  subject: [{ required: true, message: '学科为必填项', trigger: 'change' }]
})

//重置表单
const resetForm = (clazzForm) => {
  if (!clazzForm) return
  clazzForm.resetFields()
}

//-------------保存班级信息 
const save = (clazzForm) => {
  console.log('clazzForm: ' + clazz);
  // debugger;
  //表单校验
  if(!clazzForm) return
  clazzForm.validate(async (valid) => {
    if(valid) {
      let api 
      if(clazz.value.id) {
        api = updateApi(clazz.value)
      }else {
        api = addApi(clazz.value)
      }

      let result = await api
      if(result.code) {
        ElMessage.success('操作成功')
        dialogFormVisible.value = false
        queryPage()
      }else {
        ElMessage.error(result.msg)
      }
    }else {
      console.log('valid: '+ valid);
      
      return false
    }
  })
}


//------- 删除班级
//根据ID删除单个班级
const delById = async (id) => {
  ElMessageBox.confirm('您确认删除此数据吗?' , '删除班级', {confirmButtonText:'确认', cancelButtonText:'取消',type:'warning'})
    .then(async () => {
      let result =  await deleteApi(id)
      if(result.code) {
        ElMessage.success('删除成功')
        queryPage()
      }else {
        ElMessage.error(result.msg)
      }
    }).catch(() => {
      ElMessage.info('取消删除')
    })
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">班级管理</h2>
    </div>

    <div class="search-card">
      <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
        <el-form-item label="班级名称">
          <el-input class="search-input" v-model="searchClazz.name" placeholder="请输入班级名称" clearable/>
        </el-form-item>
        
        <el-form-item label="结课时间">
          <el-date-picker
            v-model="searchClazz.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item class="search-btn-group">
          <el-button class="btn-search" type="primary" @click="queryPage()">
            <el-icon><Search /></el-icon><span>查询</span>
          </el-button>
          <el-button class="btn-clear" type="info" plain @click="clear()">
            <el-icon><RefreshRight /></el-icon><span>清空</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="action-bar">
      <el-button class="btn-add" type="success" @click="addClazz();resetForm(clazzFormRef)">
        <el-icon><Plus /></el-icon><span>新增班级</span>
      </el-button>
    </div>
    
    <el-table 
      :data="tableData" 
      border 
      style="width: 100%" 
      fit
      :header-cell-style="{ background: '#f5f7fa', color: '#555555', fontWeight: 'bold' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="name" label="班级名称" align="center" width="180px" />
      <el-table-column prop="room" label="班级教室" align="center" width="110px"/>
      <el-table-column prop="masterName" label="班主任" align="center" width="110px"/>
      <el-table-column prop="beginDate" label="开课时间" align="center" width="130px"/>
      <el-table-column prop="endDate" label="结课时间" align="center" width="130px"/>
      <el-table-column prop="status" label="状态" align="center" width="110px">
        <template #default="scope">
          <el-tag :type="scope.row.status === '已结课' ? 'info' : 'success'" effect="light">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后修改时间" align="center" width="180px" />
      <el-table-column label="操作" align="center" min-width="150px">
        <template #default="scope">
          <el-button class="btn-table-edit" type="primary" plain size="small" @click="updateClazz(scope.row.id); resetForm(clazzFormRef)">
            <el-icon><Edit /></el-icon><span>编辑</span>
          </el-button>
          <el-button class="btn-table-delete" type="danger" size="small" @click="delById(scope.row.id)">
            <el-icon><Delete /></el-icon><span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="480px" class="custom-dialog">
      <el-form :model="clazz" ref="clazzFormRef" :rules="rules" label-width="90px">
        <el-form-item label="班级名称" prop="name" class="dialog-item">
          <el-input v-model="clazz.name" placeholder="请输入班级名称" clearable />
        </el-form-item>

        <el-form-item label="班级教室" prop="room" class="dialog-item">
          <el-input v-model="clazz.room" placeholder="请输入班级教室" clearable />
        </el-form-item>
        
        <el-form-item label="开课时间" prop="beginDate" class="dialog-item">
          <el-date-picker v-model="clazz.beginDate" type="date" placeholder="请选择开课时间" value-format="YYYY-MM-DD" style="width: 100%;"/>
        </el-form-item>

        <el-form-item label="结课时间" prop="endDate" class="dialog-item">
          <el-date-picker v-model="clazz.endDate" type="date" placeholder="请选择结课时间" value-format="YYYY-MM-DD" style="width: 100%;"/>
        </el-form-item>

        <el-form-item label="班主任" class="dialog-item">
          <el-select v-model="clazz.masterId" placeholder="请选择班主任" style="width: 100%;" clearable>
            <el-option v-for="emp in emps" :key="emp.id" :label="emp.name" :value="emp.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="学科" prop="subject" class="dialog-item">
          <el-select v-model="clazz.subject" placeholder="请选择学科" style="width: 100%;">
            <el-option v-for="sub in subjects" :key="sub.value" :label="sub.name" :value="sub.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-dialog-cancel" @click="dialogFormVisible = false; resetForm(clazzFormRef)">取 消</el-button>
          <el-button class="btn-dialog-save" type="primary" @click="save(clazzFormRef)">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 页面基础容器 */
.page-container {
  padding: 4px;
}

/* 模块统一顶栏样式 */
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

/* 搜索表单轻卡片修饰 */
.search-card {
  background-color: #fcfdfe;
  border: 1px solid #eef1f6;
  border-radius: 8px;
  padding: 18px 18px 2px 18px;
  margin-bottom: 18px;
}

.search-input {
  width: 200px;
}

.search-btn-group {
  margin-left: 10px;
}

.btn-search {
  background-color: #006266;
  border-color: #006266;
  font-weight: 600;
}

.btn-search:hover {
  background-color: #004d4f;
  border-color: #004d4f;
}

.btn-clear {
  border-color: #dcdfe6;
  color: #606266;
}

/* 按钮控制栏 */
.action-bar {
  margin-bottom: 14px;
  display: flex;
}

/* 统一采用科技感品牌渐变的新增按钮 */
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

/* 表格内部功能性按钮美化 */
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

/* 分页区外联间距 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 4px;
}

/* 组件样式穿透穿入 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

:deep(.el-table__header-wrapper th) {
  border-bottom: 2px solid #e6f7ff !important;
}

:deep(.el-input__wrapper.is-focus), :deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #006266 inset !important;
}

/* 弹出层对话框微调 */
:deep(.el-dialog.custom-dialog) {
  border-radius: 10px;
  overflow: hidden;
  padding: 24px;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  color: #333333;
}

.dialog-item {
  margin-bottom: 20px !important;
}

/* 弹窗页脚控制 */
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