<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryPageApi, addEmpApi, queryInfoApi, updateEmpApi, deleteEmpApi} from '@/api/emp'
import { queryAllApi as queryAllDeptApi } from '@/api/dept'

//职位列表数据
const jobs = ref([{ name: '班主任', value: 1 },{ name: '讲师', value: 2 },{ name: '学工主管', value: 3 },{ name: '教研主管', value: 4 },{ name: '咨询师', value: 5 },{ name: '其他', value: 6 }])
//性别列表数据
const genders = ref([{ name: '男', value: 1 }, { name: '女', value: 2 }])
//部门列表数据
const deptList = ref([])

const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: ''
})

//侦听searchEmp中的date属性
watch(
  () => searchEmp.value.date,
  (newValue, oldValue) => {
     if(newValue.length == 2){
      searchEmp.value.begin = newValue[0]
      searchEmp.value.end = newValue[1]
     }else {
      searchEmp.value.begin = ''
      searchEmp.value.end = ''
     }
  }
)

//声明token
const token = ref('')

onMounted(async () => {
  handleSearch()

  //加载所有部门数据
  const result = await queryAllDeptApi();
  if(result.code){
    deptList.value = result.data
  }

  //加载localStorage存储的员工登录信息
  const loginUser =  localStorage.getItem('loginUser');
  if(loginUser){
    token.value = JSON.parse(loginUser).token
  }
})

//查询员工
const handleSearch = async () => {
  console.log('Search:', searchEmp.value)
  const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender, searchEmp.value.begin, searchEmp.value.end, currentPage.value, pageSize.value);
  if(result.code){
    empList.value = result.data.rows
    total.value = result.data.total
  }
}

const handleReset = () => {
  // 清空表单
  searchEmp.value = {
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: ''
  }
  handleSearch()
}

// 示例数据
const empList = ref([])

// 分页配置
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 职位转换函数
const getJobTitle = (job) => {
  switch (job) {
    case 1:
      return '班主任'
    case 2:
      return '讲师'
    case 3:
      return '学工主管'
    case 4:
      return '教研主管'
    case 5:
      return '咨询师'
    default:
      return '其他'
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 操作处理
const handleEdit = async (id) => {
  console.log('Edit:', id)
  const result = await queryInfoApi(id);
  if(result.code){
    dialogVisible.value = true
    dialogTitle.value = '修改员工'
    employee.value = result.data

    //处理返回的工作经历信息
    let exprList = employee.value.exprList;
    if(exprList && exprList.length > 0){
      exprList.forEach(expr => {
        expr.exprDate = [expr.begin, expr.end]
      })
    }
  }
}

// 删除单个员工
const handleDelete = async (id) => {
  //弹出一个确认框, 如果确认, 就删除;
  ElMessageBox.confirm('确定删除该员工吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 删除员工
    const result = await deleteEmpApi(id);
    if(result.code){
      ElMessage.success('删除员工成功')
      handleSearch()
    }else{
      ElMessage.error(result.msg)
    }
  })
}

//新增员工
const addEmp = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增员工'
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }
  employeeFormRef.value.resetFields()
}


//新增/修改表单
const employeeFormRef = ref(null)
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

//表单校验规则
// 验证规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
});

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

// 图片上传成功后触发
const handleAvatarSuccess = (response,uploadFile) => {
  employee.value.image = response.data
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}


//工作经历
//动态添加工作经历 .
const addExprItem = () => {
  employee.value.exprList.push({exprDate: [], begin: '', end: '', company: '', job: ''})
}

//动态删除工作经历 .
const delExprItem = (index) => {
  employee.value.exprList.splice(index, 1)
}

//保存员工信息
const save = async () => {
  //在保存前统一将工作经历的日期数组转换为独立的 begin/end 字符串字段
  if(employee.value.exprList && employee.value.exprList.length > 0){
    employee.value.exprList.forEach(expr => {
      expr.begin = expr.exprDate[0] || ''
      expr.end = expr.exprDate[1] || ''
    })
  }
  employeeFormRef.value.validate(async valid => {
    if(valid){ // 校验通过
      let result ;
      if(employee.value.id){ //存在ID, 修改
        result = await updateEmpApi(employee.value);
      }else { //不存在ID, 新增
        result = await addEmpApi(employee.value);
      }
      if(result.code){
        ElMessage.success('操作成功')
        dialogVisible.value = false
        handleSearch()
      }else {
        ElMessage.error(result.msg)
      }
    }
  })
}

// 存储选中的 ID
const selectedIds = ref([]);

// 处理复选框选择变化的函数
function handleSelectionChange(selection) {
  const ids = selection.map(item => item.id);
  selectedIds.value = ids;
}

//批量删除
const deleteByIds = async () => {
  //进行非空防御性拦截判断
  if(selectedIds.value.length === 0){
    ElMessage.warning('请先勾选需要删除的员工记录')
    return
  }
  //弹出一个确认框, 如果确认, 就删除;
  ElMessageBox.confirm('确定删除选中员工吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 删除员工
    const result = await deleteEmpApi(selectedIds.value);
    if(result.code){
      ElMessage.success('批量删除员工成功')
      handleSearch()
    }else{
      ElMessage.error(result.msg)
    }
  })
}

</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">员工管理</h2>
    </div>

    <div class="search-card">
      <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input class="search-input" v-model="searchEmp.name" placeholder="请输入员工姓名" clearable></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select class="search-select" v-model="searchEmp.gender" placeholder="请选择" clearable>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入职日期">
          <el-date-picker
            v-model="searchEmp.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>

        <el-form-item class="search-btn-group">
          <el-button class="btn-search" type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon><span>查询</span>
          </el-button>
          <el-button class="btn-clear" @click="handleReset">
            <el-icon><RefreshRight /></el-icon><span>清空</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-bar">
      <el-button class="btn-add" type="primary" @click="addEmp"> 
        <el-icon><Plus /></el-icon><span>新增员工</span>
      </el-button>
      <el-button class="btn-delete-batch" type="danger" plain @click="deleteByIds"> 
        <el-icon><Delete /></el-icon><span>批量删除</span>
      </el-button>
    </div>

    <el-table 
      :data="empList" 
      border 
      style="width: 100%" 
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#f5f7fa', color: '#555555', fontWeight: 'bold' }"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.gender == 1 ? 'primary' : 'danger'" effect="plain" size="small">
            {{ scope.row.gender == 1 ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="140" align="center">
        <template #default="scope">
          <div class="avatar-cell-wrapper">
            <img v-if="scope.row.image" :src="scope.row.image" alt="Avatar" class="table-avatar" />
            <el-avatar v-else :size="36" icon="UserFilled" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" width="160" align="center"></el-table-column>
      <el-table-column label="职位" width="130" align="center">
        <template #default="scope">
          {{ getJobTitle(scope.row.job) }}
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="150" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最后操作时间" width="190" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="150px">
        <template #default="scope">
          <el-button class="btn-table-edit" size="small" type="primary" plain @click="handleEdit(scope.row.id)">
            <el-icon><Edit /></el-icon><span>编辑</span>
          </el-button>
          <el-button class="btn-table-delete" size="small" type="danger" @click="handleDelete(scope.row.id)">
            <el-icon><Delete /></el-icon><span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="760px" class="custom-dialog">
      <el-form ref="employeeFormRef" :model="employee" :rules="rules" label-width="90px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" class="dialog-form-item">
              <el-input v-model="employee.username" placeholder="请输入员工用户名"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" class="dialog-form-item">
              <el-input v-model="employee.name" placeholder="请输入员工姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" class="dialog-form-item">
              <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
                <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone" class="dialog-form-item">
              <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="职位" class="dialog-form-item">
              <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
                <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary" class="dialog-form-item">
              <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属部门" class="dialog-form-item">
              <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
                <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" class="dialog-form-item">
              <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="头像" class="dialog-form-item">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :headers="{'token': token}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="employee.image" :src="employee.image" class="dialog-upload-avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        
        <div class="sub-form-divider">
          <span class="sub-form-title"><el-icon><Compass /></el-icon> 工作经历</span>
          <el-button class="btn-expr-add" type="success" size="small" plain @click="addExprItem">
            <el-icon><Plus /></el-icon><span>添加经历</span>
          </el-button>
        </div>
        
        <div class="expr-list-wrapper">
          <el-row :gutter="12" v-for="(expr, index) in employee.exprList" :key="index" class="expr-row-item">
            <el-col :span="9">
              <el-form-item size="small" label="时间" label-width="45px">
                <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item size="small" label="公司" label-width="45px">
                <el-input placeholder="公司名称" v-model="expr.company"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item size="small" label="职位" label-width="45px">
                <el-input placeholder="担当职位" v-model="expr.job"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3" class="expr-del-col">
              <el-button type="danger" size="small" plain @click="delExprItem(index)">
                <el-icon><Delete /></el-icon><span>删除</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
          <el-button class="btn-dialog-save" type="primary" @click="save">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 基础容器 */
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

/* 条件搜索轻量化灰色卡片包装 */
.search-card {
  background-color: #fcfdfe;
  border: 1px solid #eef1f6;
  border-radius: 8px;
  padding: 18px 18px 2px 18px;
  margin-bottom: 18px;
}

.search-input, .search-select {
  width: 180px;
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

/* 控制功能按键栏 */
.action-bar {
  margin-bottom: 14px;
  display: flex;
  gap: 12px;
}

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

.btn-delete-batch {
  font-weight: 600;
  height: 36px;
  border-radius: 6px;
}

/* 表格内组件微调 */
.avatar-cell-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

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

/* 分页容器靠右 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 4px;
}

/* 深度组件穿透注入 */
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

/* 复杂弹出框微调 */
:deep(.el-dialog.custom-dialog) {
  border-radius: 10px;
  overflow: hidden;
  padding: 24px;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  color: #333333;
}

.dialog-form-item {
  margin-bottom: 18px !important;
}

/* 头像上传美化区 */
.avatar-uploader {
  display: inline-block;
}

.dialog-upload-avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}

.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.avatar-uploader-icon:hover {
  border-color: #006266;
}

/* 工作经历子表单小标题分割样式 */
.sub-form-divider {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 14px 0;
  padding-bottom: 6px;
  border-bottom: 1px dashed #e8e8e8;
}

.sub-form-title {
  font-size: 15px;
  font-weight: 700;
  color: #555555;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-expr-add {
  font-weight: 600;
}

/* 动态项内容体 */
.expr-list-wrapper {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.expr-row-item {
  margin-bottom: 12px;
  background-color: #fafbfc;
  padding: 8px 4px;
  border-radius: 4px;
  border: 1px solid #f0f2f5;
}

.expr-row-item :deep(.el-form-item) {
  margin-bottom: 0 !important;
}

.expr-del-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 对话框页脚按钮 */
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