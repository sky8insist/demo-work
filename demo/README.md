# Dayend

Dayend 是一个用于睡前收尾的本地优先体验。它把“仍未结束的事情”和“还没说完的情绪”分成两条路径：Day Closure 帮助用户逐项关闭 open loops，Emotion Bottle 则把情绪留到第二天再安静打开。

项目的原始产品构想由作者保存在仓库根目录的 [`产品说明.md`](../产品说明.md)，构建过程不会改写该文件。

## 下载后直接打开

仓库中包含已经构建好的离线版本：

1. 下载并解压仓库。
2. 进入 `demo/dist/`。
3. 双击 `Dayend.html`。

请保留 `Dayend.html`、`assets/` 与 `audio/` 的相对位置。该入口会把 JavaScript 和 CSS 内联到 HTML 中，因此不需要安装 Node.js，也不需要启动本地服务器；音乐、字体和图标仍从同级构建资源读取。

## 开发与构建

需要 Node.js 22 或更高版本。

```powershell
cd demo
npm ci
npm run dev
```

生成 GitHub Pages 与本地双击版本：

```powershell
cd demo
npm run build
```

构建完成后：

- `dist/index.html` 用于 GitHub Pages 或任意静态服务器；
- `dist/Dayend.html` 用于下载后直接双击打开；
- `dist/assets/` 与 `dist/audio/` 是两种入口共用的本地资源。

## GitHub Pages

推送到 `main` 后，仓库根目录的 `.github/workflows/deploy-pages.yml` 会进入 `demo/` 安装依赖、构建并发布 `demo/dist/`。Pages 来源需设置为 **GitHub Actions**。

发布地址：

```text
https://sky8insist.github.io/demo-work/
```

应用使用相对资源路径，可以直接运行在仓库子路径下，不依赖 FastAPI、数据库或远程 AI 服务。

## 验证

```powershell
cd demo
npm run build
npm run test:e2e
python -m unittest discover -s backend/tests -v
```

核心验收包括：

- 桌面与移动端没有横向溢出；
- Day Closure 可以逐项完成收尾并生成次晨交接；
- Emotion Bottle 在次日根据昨晚状态给出克制、具体的鼓励语；
- 高风险表达立即显示安全提示，不延迟到第二天；
- GitHub Pages 与离线 `Dayend.html` 均使用本地 Mock，可独立运行。

## 目录说明

```text
产品说明.md                 作者填写的原始产品内容
.github/workflows/          GitHub Pages 必需的仓库级自动化配置
demo/                       应用源码、README、测试与构建产物
```
