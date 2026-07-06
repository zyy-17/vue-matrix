# Matrix 智启学习管理系统

基于 **Vue 3 + Vite + Element Plus**（前端）和 **Spring Boot 3 + MyBatis + MySQL**（后端）构建的培训机构综合管理平台，涵盖班级学员管理、部门员工管理、数据报表统计等功能模块。

| 端 | 仓库地址 |
|----|----------|
| 前端 | [zyy-17/vue-matrix](https://github.com/zyy-17/vue-matrix) |
| 后端 | [zyy-17/matrix-management](https://github.com/zyy-17/matrix-management) |

## 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.2.38 | 渐进式前端框架（Composition API + `<script setup>`） |
| Vite | ^3.0.9 | 前端构建工具 |
| Element Plus | ^2.4.4 | UI 组件库（中文语言包） |
| Pinia | ^2.0.21 | 状态管理 |
| Vue Router | ^4.1.5 | 路由管理 |
| Axios | ^1.7.2 | HTTP 请求库 |
| ECharts | ^5.5.1 | 数据可视化图表 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.5 | Java 应用框架 |
| Java | 21 | 运行环境 |
| MyBatis | 3.0.3 | ORM 持久层框架（含 PageHelper 分页插件） |
| MySQL | 8.0 | 关系型数据库 |
| JWT (jjwt) | 0.11.5 | Token 认证 |
| Aliyun OSS | — | 头像文件上传 |
| Lombok | — | 代码简化 |

## 功能模块

### 1. 登录认证
- 用户名 / 密码登录
- JWT Token 认证（Axios 请求拦截器自动携带）
- 路由导航守卫（未登录 → 登录页，已登录 → 首页）
- 401 自动清除登录态并跳转登录页
- 退出登录确认

### 2. 首页仪表盘
- 系统概览信息展示

### 3. 班级学员管理
- **班级管理** — 班级的增删改查、分页条件查询（按名称、结课时间筛选）
- **学员管理** — 学员的增删改查、批量删除、分页条件查询（按班级、学历、姓名筛选）、违纪扣分处理

### 4. 系统信息管理
- **部门管理** — 部门的增删改查
- **员工管理** — 员工的增删改查、批量删除、分页条件查询（按姓名、性别、入职日期筛选）、工作经历管理、头像上传（OSS）

### 5. 数据统计管理
- **员工信息统计** — 各职位人数柱状图、员工性别分布饼图（ECharts）
- **学员信息统计** — 各班级人数柱状图、学员学历分布环形图（ECharts）
- **日志信息统计** — 操作日志分页查询

## 项目结构

```
vue-matrix/                          # 前端项目
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                         # API 接口层
│   │   ├── clazz.js                 #   班级管理 (5 个接口)
│   │   ├── dept.js                  #   部门管理 (5 个接口)
│   │   ├── emp.js                   #   员工管理 (6 个接口)
│   │   ├── log.js                   #   日志管理 (1 个接口)
│   │   ├── login.js                 #   登录 (1 个接口)
│   │   ├── report.js                #   数据统计 (4 个接口)
│   │   └── stu.js                   #   学员管理 (6 个接口)
│   ├── assets/                      # 静态资源
│   │   ├── bg1.jpg
│   │   ├── index.png
│   │   └── main.css
│   ├── router/
│   │   └── index.js                 # 路由配置 + 导航守卫
│   ├── utils/
│   │   └── request.js               # Axios 实例 & 拦截器 (baseURL: /api)
│   ├── views/                       # 页面组件
│   │   ├── login/                   #   登录页
│   │   ├── layout/                  #   布局框架（侧边栏 + 顶栏）
│   │   ├── index/                   #   首页仪表盘
│   │   ├── clazz/                   #   班级管理页
│   │   ├── stu/                     #   学员管理页
│   │   ├── dept/                    #   部门管理页
│   │   ├── emp/                     #   员工管理页
│   │   ├── log/                     #   日志管理页
│   │   └── report/
│   │       ├── emp/                 #   员工统计页
│   │       └── stu/                 #   学员统计页
│   ├── App.vue
│   └── main.js
├── .eslintrc.cjs
├── .prettierrc.json
├── .gitignore
├── .env.example
├── index.html
├── package.json
└── vite.config.js

matrix-management/                   # 后端项目
├── src/main/java/com/itheima/
│   ├── controller/                  # REST 控制器 (根路径)
│   │   ├── ClazzController.java     #   /clazzs
│   │   ├── DeptController.java      #   /depts
│   │   ├── EmpController.java       #   /emps
│   │   ├── LoginController.java     #   /login
│   │   ├── OperateLogController.java #  /log
│   │   ├── ReportController.java    #   /report
│   │   ├── StudentController.java   #   /students
│   │   └── UploadController.java    #   /upload
│   ├── service/                     # 业务逻辑层
│   ├── mapper/                      # MyBatis 数据访问层
│   ├── pojo/                        # 实体类 & DTO (15 个类)
│   ├── interceptor/                 # Token 拦截器 (JWT 校验)
│   ├── config/                      # 配置类 (拦截器注册)
│   ├── utils/                       # 工具类 (JWT、OSS)
│   └── anno/aop/                    # 自定义注解 & AOP 操作日志
├── src/main/resources/
│   ├── application.yml              # 主配置 (MySQL、OSS、端口 8080)
│   └── com/itheima/mapper/          # MyBatis XML 映射文件
├── tlias.sql                        # 数据库初始化脚本 (7 张表)
└── pom.xml
```

## API 接口一览

> **路径说明：** 前端 Axios 实例统一使用 `baseURL: '/api'`，所有请求路径为 `/api/xxx`。后端 Controller 映射到根路径（`/clazzs`、`/login` 等）。开发环境中 Vite 代理自动剥离 `/api` 前缀后转发至后端；生产环境由 Nginx 完成同样的转发与重写。

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 登录 | POST | `/api/login` | 用户登录（无需 Token） |
| 班级 | GET | `/api/clazzs` | 分页条件查询 |
| 班级 | POST | `/api/clazzs` | 新增班级 |
| 班级 | GET | `/api/clazzs/{id}` | 根据 ID 查询 |
| 班级 | PUT | `/api/clazzs` | 更新班级 |
| 班级 | DELETE | `/api/clazzs/{id}` | 删除班级 |
| 班级 | GET | `/api/clazzs/list` | 查询全部班级 |
| 学员 | GET | `/api/students` | 分页条件查询 |
| 学员 | POST | `/api/students` | 新增学员 |
| 学员 | GET | `/api/students/{id}` | 根据 ID 查询 |
| 学员 | PUT | `/api/students` | 更新学员 |
| 学员 | DELETE | `/api/students/{ids}` | 删除学员（支持逗号分隔批量） |
| 学员 | PUT | `/api/students/violation/{id}/{score}` | 违纪扣分 |
| 部门 | GET | `/api/depts` | 查询全部部门 |
| 部门 | POST | `/api/depts` | 新增部门 |
| 部门 | GET | `/api/depts/{id}` | 根据 ID 查询 |
| 部门 | PUT | `/api/depts` | 更新部门 |
| 部门 | DELETE | `/api/depts?id={id}` | 删除部门 |
| 员工 | GET | `/api/emps` | 分页条件查询 |
| 员工 | POST | `/api/emps` | 新增员工 |
| 员工 | GET | `/api/emps/{id}` | 根据 ID 查询 |
| 员工 | PUT | `/api/emps` | 更新员工 |
| 员工 | DELETE | `/api/emps?ids={ids}` | 删除员工（支持逗号分隔批量） |
| 员工 | GET | `/api/emps/list` | 查询全部员工 |
| 上传 | POST | `/api/upload` | 头像上传至阿里云 OSS |
| 日志 | GET | `/api/log/page` | 分页查询操作日志 |
| 统计 | GET | `/api/report/empJobData` | 员工职位人数统计 |
| 统计 | GET | `/api/report/empGenderData` | 员工性别分布统计 |
| 统计 | GET | `/api/report/studentCountData` | 各班人数统计 |
| 统计 | GET | `/api/report/studentDegreeData` | 学员学历分布统计 |

> 所有接口（除 `/api/login` 外）需在请求头中携带 `token` 字段。后端 `TokenInterceptor` 校验 JWT，返回 401 时前端自动清除登录态并跳转登录页。`/login`、`/upload` 路径已在拦截器中排除。

### 统一响应格式

```json
{
  "code": 1,       // 1: 成功, 0: 失败
  "msg": "success",
  "data": {}
}
```

分页查询返回 `PageResult`：
```json
{
  "code": 1,
  "msg": "success",
  "data": {
    "total": 100,
    "rows": []
  }
}
```

### 状态码约定

| code | 含义 |
|------|------|
| 1 | 操作成功 |
| 0 | 业务错误（msg 中包含错误描述） |
| 401 (HTTP) | Token 无效或过期，前端自动跳转登录页 |

## 快速开始

### 环境要求

| 环境 | 版本要求 |
|------|---------|
| Node.js | >= 16.0.0 |
| npm | >= 7.0.0 |
| Java (JDK) | >= 21 |
| MySQL | >= 8.0 |
| Maven | >= 3.6 |

### 1. 启动后端

```sh
# 克隆后端仓库
git clone https://github.com/zyy-17/matrix-management.git
cd matrix-management

# 导入数据库（在 MySQL 中创建 tlias 库并执行 tlias.sql）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tlias DEFAULT CHARSET utf8mb4;"
mysql -u root -p tlias < tlias.sql

# 修改 src/main/resources/application.yml 中的数据库连接信息
# （默认连接：192.168.100.128:3306, 用户名 root, 密码 1234）

# 启动后端服务（默认端口 8080）
mvn spring-boot:run
```

验证后端：访问 `http://localhost:8080/login`（应返回业务错误提示，表示服务正常）。

### 2. 启动前端

```sh
# 克隆前端仓库
git clone https://github.com/zyy-17/vue-matrix.git
cd vue-matrix

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173` 即可进入登录页面。

> **开发代理说明：** `vite.config.js` 已配置代理——`/api` 开头的请求自动转发至 `http://localhost:8080`，并剥离 `/api` 前缀（例如 `/api/clazzs` → `/clazzs`），与后端 Controller 根路径映射保持一致。

### 3. 生产部署

```sh
# 构建前端
npm run build
```

构建产物输出到 `dist/` 目录。将 `dist/` 中的文件部署至 Nginx，并配置反向代理：

```nginx
server {
    listen       80;
    server_name  localhost;

    # 前端静态资源（HTML5 History 模式需 try_files 回退）
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理（剥离 /api 前缀后转发至后端）
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 前后端字段对照

### 员工 (Emp)

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `username` | `username` | String | 用户名（登录用） |
| `name` | `name` | String | 姓名 |
| `gender` | `gender` | Integer | 性别 (1:男, 2:女) |
| `phone` | `phone` | String | 手机号 |
| `job` | `job` | Integer | 职位 (1-6) |
| `salary` | `salary` | Integer | 薪资 |
| `deptId` | `deptId` | Integer | 部门 ID |
| `entryDate` | `entryDate` | LocalDate | 入职日期 |
| `image` | `image` | String | 头像 URL (OSS) |
| `exprList[].begin` | `begin` | LocalDate | 工作经历开始日期 |
| `exprList[].end` | `end` | LocalDate | 工作经历结束日期 |
| `exprList[].company` | `company` | String | 公司名称 |
| `exprList[].job` | `job` | String | 职位名称 |

> **日期转换说明：** 前端使用 `exprDate`（数组 `[begin, end]`）绑定 Element Plus 日期范围选择器。保存时 `save()` 拆分为独立的 `begin`/`end` 字段；编辑加载时 `handleEdit()` 反向合并回 `exprDate`。

### 学员 (Student)

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `name` | `name` | String | 姓名 |
| `no` | `no` | String | 学号 |
| `gender` | `gender` | Integer | 性别 (1:男, 2:女) |
| `phone` | `phone` | String | 手机号 |
| `idCard` | `idCard` | String | 身份证号 |
| `isCollege` | `isCollege` | Integer | 是否院校学员 (1:是, 0:否) |
| `degree` | `degree` | Integer | 学历 (1-6) |
| `address` | `address` | String | 联系地址 |
| `graduationDate` | `graduationDate` | LocalDate | 毕业时间 |
| `clazzId` | `clazzId` | Integer | 班级 ID |

### 班级 (Clazz)

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `name` | `name` | String | 班级名称 |
| `room` | `room` | String | 教室 |
| `beginDate` | `beginDate` | LocalDate | 开课时间 |
| `endDate` | `endDate` | LocalDate | 结课时间 |
| `subject` | `subject` | Integer | 学科 (1-6) |
| `masterId` | `masterId` | Integer | 班主任 ID |

### 部门 (Dept)

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `id` | `id` | Integer | 部门 ID |
| `name` | `name` | String | 部门名称 |

### 枚举值速查

| 字段 | 值 | 含义 |
|------|----|------|
| gender | 1 / 2 | 男 / 女 |
| job | 1-6 | 班主任、讲师、学工主管、教研主管、咨询师、其他 |
| subject | 1-6 | Java、前端、大数据、Python、Go、嵌入式 |
| degree | 1-6 | 初中、高中、大专、本科、硕士、博士 |
| isCollege | 0 / 1 | 否 / 是 |

## 数据库表设计

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `dept` | 部门表 | id, name, create_time, update_time |
| `emp` | 员工表 | id, username, password, name, gender, phone, job, salary, image, entry_date, dept_id |
| `emp_expr` | 员工工作经历表 | id, emp_id, begin, end, company, job |
| `emp_log` | 员工操作日志表 | id, operate_time, class_name, method_name, method_params, return_value, cost_time |
| `clazz` | 班级表 | id, name, room, begin_date, end_date, master_id, subject |
| `student` | 学员表 | id, name, no, gender, phone, id_card, is_college, address, degree, graduation_date, clazz_id, violation_count, violation_score |
| `operate_log` | AOP 操作日志表 | id, operate_user, operate_time, class_name, method_name, method_params, return_value, cost_time |

## License

本项目仅供学习参考使用。
