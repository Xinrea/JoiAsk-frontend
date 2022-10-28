# JoiAsk frontend

使用 Svelte + Tailwind CSS 实现的 JoiAsk 前端，后端以及部署指南请见 [JoiAsk](https://github.com/Xinrea/JoiAsk)。

![](screenshot.png)

## 构建

```bash
npm install
npm run build
```

## 自定义

### 修改网站标题

在 `index.html` 中替换网站标题，然后重新构建。

### 修改网站图标

网站图标文件为 `public/favicon.png` ，大小为 `144x144`，替换后重新构建。

### 修改网站背景

网站背景文件为 `src/assets/background.svg` ，可在 `src/app.css` 的 `body` 样式中设定，替换后重新构建。

### 定制主题颜色

打开 `tailwind.config.js` 找到 `theme` 部分，修改 `colors` 中的颜色设定，然后重新构建。

```json
{
  ...
  theme: {
    extend: {
      colors: {
        'primary': '#ff9800',
        'card': '#fff7ed',
        'background': '#fedcae'
      }
    }
  },
  ...
}
```

其中 `primary` 为主题色，`card` 为卡片颜色，`background` 为网页背景颜色。