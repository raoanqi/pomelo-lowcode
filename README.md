# Pomelo 低代码平台

Pomelo 低代码平台是一个基于 Vue 3 和 Element Plus 的可视化低代码开发工具，允许用户通过拖拽操作快速构建界面。该项目旨在简化前端开发流程，提高开发效率，使非专业开发人员也能轻松创建专业的用户界面。

## 功能特点

- **组件拖拽**: 通过拖拽快速布局界面组件
- **属性配置**: 实时编辑组件的属性和样式
- **组件库**: 提供丰富的 Element Plus 组件
- **导出功能**: 支持将设计导出为 JSON 文件
- **组件保存**: 可以将设计保存为自定义组件以供复用
- **实时预览**: 实时查看设计效果

## 技术栈

- **前端框架**: Vue 3.5.13
- **构建工具**: Vite 6.2.0
- **UI 框架**: Element Plus 2.9.6
- **拖拽库**: vuedraggable 4.1.0
- **图标库**: @element-plus/icons-vue 2.3.1
- **代码规范**: ESLint 9 + Prettier 3

## 项目结构

```
pomelo-lowcode/
├── src/                  # 源代码目录
│   ├── components/       # 组件目录
│   │   ├── Canvas.vue    # 画布组件（中间区域）
│   │   ├── ComponentPanel.vue  # 组件面板（左侧区域）
│   │   ├── ConfigPanel.vue     # 配置面板（右侧区域）
│   │   └── SavedComponentsPanel.vue  # 已保存组件面板
│   ├── assets/           # 静态资源
│   ├── utils/            # 工具函数
│   ├── App.vue           # 主应用组件
│   ├── main.js           # 入口文件
│   └── style.css         # 全局样式
├── public/               # 公共资源目录
├── .vscode/              # VS Code配置
├── .eslintignore         # ESLint忽略配置
├── .prettierignore       # Prettier忽略配置
├── .prettierrc.js        # Prettier配置
├── eslint.config.js      # ESLint配置（使用新的Flat Config格式）
├── index.html            # HTML入口文件
├── package.json          # 项目依赖配置
└── vite.config.js        # Vite配置文件
```

## 快速开始

### 安装依赖

```bash
# 使用pnpm安装依赖（推荐）
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或使用npm
npm run dev

# 或使用yarn
yarn dev
```

### 构建项目

```bash
# 构建生产版本
pnpm build

# 或使用npm
npm run build

# 或使用yarn
yarn build
```

### 预览构建结果

```bash
# 预览生产构建
pnpm preview
```

## 代码规范

本项目使用ESLint和Prettier来确保代码质量和一致的代码风格。

### Prettier配置

项目使用以下Prettier配置：
- 不使用分号结尾
- 使用单引号
- 打印宽度为100字符
- 缩进为2个空格
- 箭头函数尽可能省略括号

### 代码格式化

你可以使用以下命令来格式化代码：

```bash
# 格式化所有源代码文件
pnpm format

# 检查ESLint问题
pnpm lint

# 检查并修复ESLint问题
pnpm lint:fix
```

## 使用指南

1. **添加组件**: 从左侧组件面板拖拽组件到中间画布区域
2. **选中组件**: 点击画布上的组件进行选中
3. **配置组件**: 在右侧面板编辑选中组件的属性和样式
4. **调整位置**: 通过拖拽调整组件在画布中的位置
5. **导出设计**: 点击"导出JSON"按钮将当前设计导出为JSON文件
6. **保存组件**: 点击"保存为我的组件"将设计保存为可复用组件

## 贡献指南

欢迎为Pomelo低代码平台做出贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多信息。

## 许可协议

本项目基于 [MIT许可证](LICENSE) 发布。
