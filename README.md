
# 🍉 Fruit Slice - 水果切片游戏

一款将消消乐和切西瓜玩法结合的休闲小游戏！

## 🎮 游戏玩法

1. **划线消除**: 用鼠标或手指划过 3 个或更多相同的水果来消除它们
2. **连击加分**: 连续消除会获得 combo 加成，分数更高！
3. **水果掉落**: 消除后上方的水果会下落，新水果会从顶部补充

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式框架**: Tailwind CSS 3
- **状态管理**: React Hooks

## 📦 安装与运行

### 前置条件

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问: http://localhost:5173/

### 构建生产版本

```bash
npm run build
```

构建产物会输出到 `dist/` 目录

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/           # React 组件
│   ├── FruitCell.tsx    # 水果单元格组件
│   ├── GameBoard.tsx    # 游戏面板组件
│   ├── GameOverScreen.tsx # 游戏结束界面
│   └── ScorePanel.tsx   # 分数显示组件
├── hooks/               # 自定义 Hooks
│   └── useGame.ts       # 游戏核心逻辑
├── pages/               # 页面文件
│   └── Home.tsx         # 游戏主页面
├── types/               # TypeScript 类型定义
│   └── game.ts          # 游戏相关类型
├── App.tsx              # 应用入口组件
├── main.tsx             # 应用入口文件
└── index.css            # 全局样式
```

## 🎯 游戏特性

- ✨ 流畅的划线连接效果
- 📈 实时分数和最高分记录
- 🔥 连击倍增系统
- 📱 支持鼠标和触摸操作
- 🎨 精美渐变背景和动画效果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
