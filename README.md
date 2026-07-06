# Matrix 智启学习管理系统

基于 **Vue 3 + Vite + Element Plus** 构建的培训机构后台管理系统，涵盖班级学员管理、部门员工管理、数据统计分析等功能模块。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.2.38 | 前端渐进式框架 |
| Vite | ^3.0.9 | 前端构建工具 |
| Element Plus | ^2.4.4 | UI 组件库（中文语言包） |
| Pinia | ^2.0.21 | 状态管理 |
| Vue Router | ^4.1.5 | 路由管理 |
| Axios | ^1.7.2 | HTTP 请求库 |
| ECharts | ^5.5.1 | 数据可视化图表 |

## 功能模块

### 1. 登录认证
- 用户名 / 密码登录
- Token 认证（请求拦截器自动携带）
- 401 自动跳转登录页
- 退出登录确认

### 2. 首页仪表盘
- 系统概览信息展示

### 3. 班级学员管理
- **班级管理** — 班级的增删改查、分页条件查询
- **学员管理** — 学员的增删改查、分页条件查询、违纪扣分处理

### 4. 系统信息管理
- **部门管理** — 部门的增删改查
- **员工管理** — 员工的增删改查、分页条件查询

### 5. 数据统计管理
- **员工信息统计** — 各职位人数统计、员工性别分布统计（ECharts 图表）
- **学员信息统计** — 各班级人数统计、学员学历分布统计（ECharts 图表）
- **日志信息统计** — 操作日志分页查询

## 项目结构

```
vue-tlias-management/
├── public/                     # 静态资源
│   └── favicon.ico             # 网站图标
├── src/
│   ├── api/                    # API 接口层
│   │   ├── clazz.js            #   班级管理接口
│   │   ├── dept.js             #   部门管理接口
│   │   ├── emp.js              #   员工管理接口
│   │   ├── log.js              #   日志管理接口
│   │   ├── login.js            #   登录接口
│   │   ├── report.js           #   数据统计接口
│   │   └── stu.js              #   学员管理接口
│   ├── assets/                 # 资源文件
│   │   ├── bg1.jpg             #   登录页背景
│   │   ├── index.png           #   首页资源
│   │   └── main.css            #   全局样式
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── stores/
│   │   └── counter.js          # Pinia 状态管理
│   ├── utils/
│   │   └── request.js          # Axios 实例 & 拦截器
│   ├── views/                  # 页面组件
│   │   ├── login/              #   登录页
│   │   ├── layout/             #   布局框架（侧边栏 + 顶栏）
│   │   ├── index/              #   首页仪表盘
│   │   ├── clazz/              #   班级管理页
│   │   ├── stu/                #   学员管理页
│   │   ├── dept/               #   部门管理页
│   │   ├── emp/                #   员工管理页
│   │   ├── log/                #   日志管理页
│   │   └── report/             #   数据统计页
│   │       ├── emp/            #     员工统计
│   │       └── stu/            #     学员统计
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── .eslintrc.cjs               # ESLint 配置
├── .prettierrc.json            # Prettier 配置
├── .gitignore                  # Git 忽略规则
├── index.html                  # HTML 入口
├── package.json                # 项目依赖配置
├── package-lock.json           # 依赖锁定文件
└── vite.config.js              # Vite 构建配置
```

## API 接口一览

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 登录 | POST | `/api/login` | 用户登录 |
| 班级 | GET | `/api/clazzs` | 分页条件查询 |
| 班级 | POST | `/api/clazzs` | 新增班级 |
| 班级 | GET | `/api/clazzs/{id}` | 根据 ID 查询 |
| 班级 | PUT | `/api/clazzs` | 更新班级 |
| 班级 | DELETE | `/api/clazzs/{id}` | 删除班级 |
| 班级 | GET | `/api/clazzs/list` | 查询全部 |
| 学员 | GET | `/api/students` | 分页条件查询 |
| 学员 | POST | `/api/students` | 新增学员 |
| 学员 | GET | `/api/students/{id}` | 根据 ID 查询 |
| 学员 | PUT | `/api/students` | 更新学员 |
| 学员 | DELETE | `/api/students/{ids}` | 删除学员 |
| 学员 | PUT | `/api/students/violation/{id}/{score}` | 违纪扣分 |
| 部门 | GET | `/api/depts` | 查询全部 |
| 部门 | POST | `/api/depts` | 新增部门 |
| 部门 | GET | `/api/depts/{id}` | 根据 ID 查询 |
| 部门 | PUT | `/api/depts` | 更新部门 |
| 部门 | DELETE | `/api/depts?id={id}` | 删除部门 |
| 员工 | GET | `/api/emps` | 分页条件查询 |
| 员工 | POST | `/api/emps` | 新增员工 |
| 员工 | GET | `/api/emps/{id}` | 根据 ID 查询 |
| 员工 | PUT | `/api/emps` | 更新员工 |
| 员工 | DELETE | `/api/emps?ids={ids}` | 删除员工 |
| 员工 | GET | `/api/emps/list` | 查询全部 |
| 日志 | GET | `/api/log/page` | 分页查询 |
| 统计 | GET | `/api/report/empJobData` | 员工职位统计 |
| 统计 | GET | `/api/report/empGenderData` | 员工性别统计 |
| 统计 | GET | `/api/report/studentCountData` | 班级人数统计 |
| 统计 | GET | `/api/report/studentDegreeData` | 学员学历统计 |

> 所有接口（除登录外）需在请求头中携带 `token` 字段，后端返回 401 时前端自动跳转登录页。

## 快速开始

### 环境要求

- **Node.js** >= 16.0.0
- **npm** >= 7.0.0

### 安装依赖

```sh
npm install
```

### 开发运行

启动开发服务器（默认热更新）：

```sh
npm run dev
```

浏览器访问 `http://localhost:5173` 即可进入登录页面。

### 生产构建

```sh
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```sh
npm run preview
```

### 代码检查

```sh
npm run lint
```

## 开发配置

### Vite 代理配置（可选）

如需配置 API 代理，在 `vite.config.js` 中添加：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端服务地址
      changeOrigin: true
    }
  }
}
```

## License

本项目仅供学习参考使用。
