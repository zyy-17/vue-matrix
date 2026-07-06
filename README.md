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
| MyBatis | 3.0.3 | ORM 持久层框架 |
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
- **员工管理** — 员工的增删改查、批量删除、分页条件查询（按姓名、性别、入职日期筛选）、工作经历管理、头像上传

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
│   │   ├── clazz.js                 #   班级管理 (7 个接口)
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
│   │   └── request.js               # Axios 实例 & 拦截器
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
│   ├── controller/                  # REST 控制器
│   │   ├── ClazzController.java     #   /clazzs
│   │   ├── DeptController.java      #   /depts
│   │   ├── EmpController.java       #   /emps
│   │   ├── LoginController.java     #   /login
│   │   ├── OperateLogController.java #  /log
│   │   ├── ReportController.java    #   /report
│   │   ├── StudentController.java   #   /students
│   │   └── UploadController.java    #   /api/upload
│   ├── service/                     # 业务逻辑层
│   ├── mapper/                      # MyBatis 数据访问层
│   ├── pojo/                        # 实体类 & DTO
│   ├── interceptor/                 # Token 拦截器
│   ├── config/                      # 配置类
│   ├── utils/                       # 工具类（JWT、OSS）
│   └── anno/aop/                    # 自定义注解 & AOP 日志
├── src/main/resources/
│   ├── application.yml
│   └── com/itheima/mapper/          # MyBatis XML 映射
└── pom.xml
```

## API 接口一览

> **注意：** 前端通过 Axios 的 `baseURL: '/api'` 统一添加了 `/api` 前缀，所有 API 请求路径为 `/api/xxx`。后端 Controller 中除 `UploadController`（`/api/upload`）外，其余 Controller 均未带 `/api` 前缀。**生产环境需通过 Nginx 反向代理统一路径，开发环境使用 Vite proxy 转发。** 建议后端在 `application.yml` 中添加 `server.servlet.context-path=/api` 以使路径保持一致。

| 模块 | 方法 | 前端请求路径 | 后端实际路径 | 说明 |
|------|------|-------------|-------------|------|
| 登录 | POST | `/api/login` | `/login` | 用户登录 |
| 班级 | GET | `/api/clazzs` | `/clazzs` | 分页条件查询 |
| 班级 | POST | `/api/clazzs` | `/clazzs` | 新增班级 |
| 班级 | GET | `/api/clazzs/{id}` | `/clazzs/{id}` | 根据 ID 查询 |
| 班级 | PUT | `/api/clazzs` | `/clazzs` | 更新班级 |
| 班级 | DELETE | `/api/clazzs/{id}` | `/clazzs/{id}` | 删除班级 |
| 班级 | GET | `/api/clazzs/list` | `/clazzs/list` | 查询全部 |
| 学员 | GET | `/api/students` | `/students` | 分页条件查询 |
| 学员 | POST | `/api/students` | `/students` | 新增学员 |
| 学员 | GET | `/api/students/{id}` | `/students/{id}` | 根据 ID 查询 |
| 学员 | PUT | `/api/students` | `/students` | 更新学员 |
| 学员 | DELETE | `/api/students/{ids}` | `/students/{ids}` | 删除学员（支持逗号分隔批量） |
| 学员 | PUT | `/api/students/violation/{id}/{score}` | `/students/violation/{id}/{score}` | 违纪扣分 |
| 部门 | GET | `/api/depts` | `/depts` | 查询全部 |
| 部门 | POST | `/api/depts` | `/depts` | 新增部门 |
| 部门 | GET | `/api/depts/{id}` | `/depts/{id}` | 根据 ID 查询 |
| 部门 | PUT | `/api/depts` | `/depts` | 更新部门 |
| 部门 | DELETE | `/api/depts?id={id}` | `/depts?id={id}` | 删除部门 |
| 员工 | GET | `/api/emps` | `/emps` | 分页条件查询 |
| 员工 | POST | `/api/emps` | `/emps` | 新增员工 |
| 员工 | GET | `/api/emps/{id}` | `/emps/{id}` | 根据 ID 查询 |
| 员工 | PUT | `/api/emps` | `/emps` | 更新员工 |
| 员工 | DELETE | `/api/emps?ids={ids}` | `/emps?ids={ids}` | 删除员工（支持逗号分隔批量） |
| 员工 | GET | `/api/emps/list` | `/emps/list` | 查询全部 |
| 上传 | POST | `/api/upload` | `/api/upload` | 头像上传（OSS） |
| 日志 | GET | `/api/log/page` | `/log/page` | 分页查询操作日志 |
| 统计 | GET | `/api/report/empJobData` | `/report/empJobData` | 员工职位统计 |
| 统计 | GET | `/api/report/empGenderData` | `/report/empGenderData` | 员工性别统计 |
| 统计 | GET | `/api/report/studentCountData` | `/report/studentCountData` | 班级人数统计 |
| 统计 | GET | `/api/report/studentDegreeData` | `/report/studentDegreeData` | 学员学历统计 |

> 所有接口（除 `/api/login` 外）需在请求头中携带 `token` 字段，后端 TokenInterceptor 校验 JWT，返回 401 时前端自动清除登录态并跳转登录页。

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

# 导入数据库（在 MySQL 中执行 tlias.sql）
mysql -u root -p < tlias.sql

# 修改 src/main/resources/application.yml 中的数据库连接信息

# 启动后端服务（默认端口 8080）
mvn spring-boot:run
```

### 2. 启动前端

```sh
# 克隆前端仓库
git clone https://github.com/zyy-17/vue-matrix.git
cd vue-matrix

# 安装依赖
npm install

# 启动开发服务器（默认端口 5173，自动代理 /api → localhost:8080）
npm run dev
```

浏览器访问 `http://localhost:5173` 即可进入登录页面。

> **说明：** `vite.config.js` 已配置开发代理，将 `/api` 开头的请求转发至后端 `http://localhost:8080`。代理 **不重写路径**，因此需要后端所有 Controller 统一使用 `/api` 前缀。如需使后端与此对齐，在后端 `application.yml` 中添加：
> ```yml
> server:
>   servlet:
>     context-path: /api
> ```
> 并移除 `UploadController` 上的 `@RequestMapping("/api")` 注解以避免路径变成 `/api/api/upload`。

### 3. 生产构建

```sh
npm run build
```

构建产物输出到 `dist/` 目录，部署至 Nginx 并配置反向代理即可。

### Nginx 配置示例

```nginx
server {
    listen       80;
    server_name  localhost;

    # 前端静态资源
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理（不重写路径，要求后端已配置 context-path=/api）
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
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
| `image` | `image` | String | 头像 URL |
| `exprList[].begin` | `begin` | LocalDate | 工作经历开始日期 |
| `exprList[].end` | `end` | LocalDate | 工作经历结束日期 |
| `exprList[].company` | `company` | String | 公司名称 |
| `exprList[].job` | `job` | String | 职位名称 |

> **注意：** 前端使用 `exprDate`（日期范围数组）绑定 Element Plus 日期选择器，保存时在 `save()` 中拆分为 `begin`/`end`；编辑加载时在 `handleEdit()` 中反向合并。

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
| `address` | `address` | String | 地址 |
| `graduationDate` | `graduationDate` | LocalDate | 毕业时间 |
| `clazzId` | `clazzId` | Integer | 班级 ID |

### 班级 (Clazz)

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `name` | `name` | String | 班级名称 |
| `room` | `room` | String | 教室 |
| `beginDate` | `beginDate` | LocalDate | 开课时间 |
| `endDate` | `endDate` | LocalDate | 结课时间 |
| `subject` | `subject` | Integer | 学科 (1:Java, 2:前端, 3:大数据, 4:Python, 5:Go, 6:嵌入式) |
| `masterId` | `masterId` | Integer | 班主任 ID |

## 已知待完善项

以下为前后端对照审查中发现的协调问题，建议后续修复：

| 优先级 | 位置 | 问题 | 建议修复 |
|--------|------|------|---------|
| 🔴 高 | 后端 `WebConfig.java` | Token 拦截器排除 `/upload`，但上传实际路径为 `/api/upload` | 改为排除 `/api/upload` 或将上传改为 `/upload` |
| 🔴 高 | 后端 Controller | 除 `UploadController` 外均无 `/api` 前缀，与前端 `baseURL` 不一致 | 添加 `server.servlet.context-path=/api`，移除 `UploadController` 的 `@RequestMapping("/api")` |
| 🟡 中 | 后端 `UploadController.java` | 导入了 `File`、`UUID` 但未使用；日志中有疑似拼写错误 | 清理无用导入，修正日志内容 |

## License

本项目仅供学习参考使用。
