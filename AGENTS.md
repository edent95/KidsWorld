# AGENTS.md

> 动这个仓库之前,把这一页读完。这里只写**会让你踩坑的事实**。

## 0. 三十秒了解

小乐儿园地 Kids World Kindergarten(槟城亚依淡,3–6 岁幼儿园)的官网。纯静态 HTML,没有构建步骤、没有 npm 依赖。

```
index.html / design/index.html ──(PR 合并进 main)──▶ GitHub Pages ──▶ https://kidsworld-penang.com
```

**三件必须先知道的事:**

1. **合并进 `main` 就是上线。** GitHub Pages 从 `main` 根目录发布(`CNAME` = kidsworld-penang.com)。PR 的 `ci` 检查全过后面板 / GitHub 会自动合并,也就是自动上线 —— 不要把半成品推进 PR。
2. **这是公开仓库。** 不放家长资料、未获同意的孩子照片、内部价格;CI 跑在 GitHub 托管的 ubuntu,不上 M1 自托管 runner(公开仓库任何人都能开 fork PR)。
3. **网站上的事实要能证实。** 地址 190–190A Jalan Boundary, 11500 Ayer Itam、电话 011-1087 5302、3–6 岁、超过 20 年 —— 这些是园方给的。课程分班与一天作息目前是示意(页面上标了),不要当成真的再往外抄。

## 1. 开学礼包:必读顺序

| # | 文件 | 读它是为了 | 时间 |
|---|---|---|---|
| 1 | 本文件 | 硬约束与坑 | 3 min |
| 2 | `design/index.html`(合并后线上 /design) | 品牌规范:logo、颜色、文字色、字体、图标、组件 | 5 min |
| 3 | `index.html` 开头的 `:root` | 颜色与主题令牌 | 2 min |
| 4 | **`log.md` + `logs/entries/`** | **改动史。重点读每条的 `ripples`** | 5 min |

**接手具体任务前**,先用关键词搜一遍改动史:`grep -rn "<关键词>" log.md logs/entries/`

## 2. 本机预览

```bash
node /Users/MacBookPro/Developer/Project/personal-dashboard/scripts/wt.mjs preview <worktree 目录>
```

读 `.worktree-preview.json`,用 `python3 -m http.server` 在空闲端口起静态服务。直接双击 `index.html` 也能看,但 `<use href="#i-…">` 图标与相对路径以 http 打开为准。

## 3. 硬约束 —— 违反不会报错,只会静默出错

- **图标不要手改页面里的 `<symbol>`。** 图标由 `scripts/icons.mjs` 按黄金圆规则生成,写进页面的 `<!--icons:start-->…<!--icons:end-->` 之间;手改的下次一跑就被覆盖,CI 也会因为「生成结果和页面不一致」挂掉。改图标 = 改脚本 + `node scripts/icons.mjs`。
- **完整 logo 不许裁。** 用 `assets/logo.png` / `logo-960.png` / `logo-sm.png`;不要再做只有两个小朋友的裁切版(用户明确要求过)。
- **小字不用 logo 原色。** 草绿、天蓝、玫红原色当小字对比度不够,用规范里的 `-text` 文字色(见 /design 的对比度图)。
- **颜色都走 `:root` 令牌,浅色、深色两套都要给。** 主题由 `<html data-theme>` 决定(页面开头的小脚本设),组件里不要写只在一个主题下好看的字面颜色。
- **动画只在看得到时跑**,并且尊重 `prefers-reduced-motion`。

## 4. 改完怎么自证

```bash
npm run check      # = CI 的 ci 检查:日志格式、页面引用的本地文件都存在、图标没缺、图标生成结果与页面一致
```

再起预览,桌面 1440 + 手机 390、浅色 + 深色各看一眼(`?theme=light` / `?theme=dark` 可直接切)。

## 5. 改完必须补日志

非平凡改动都要追加一条,格式约定写在 `log.md` 开头:必填 `why` / `ripples` / `verified` / `keywords` / `learned`。

- **必须用 `npm run log:append`**(正文从 stdin,首行 `### 标题`)。本仓库有 `logs/entries/`,脚本一条一个文件,几个 PR 并行也不会在日志上冲突。**不要把 `log.md` 加进 `.gitignore`。**
- `ripples`:改了这里,谁的假设失效了?谁必须跟着改?答不出写「无」。
- `learned`:每条以 `[skill:<id>]` `[new-skill:<id>]` `[knowledge]` `[rule]` `[project]` 开头,没有写「无」。
- 写完 `npm run log:home` 刷新 `home.html`(产物,已在 `.gitignore`)。

## 6. 已知的坑与漂移

| 现象 | 真相 |
|---|---|
| 改了 favicon 浏览器还显示旧的 | 浏览器缓存;`<link rel="icon">` 带了 `?v=` 版本号,换图时把号加一 |
| 截图脚本拍出来总是深色 | 无界面 Chrome 跟着 macOS 外观;网址加 `?theme=light` 强制浅色 |
| 菜单跳转后标题被顶栏挡住 | `section` 要有 `scroll-margin-top`(顶栏高度) |
| Facebook 打不开 / 被钩子拦 | 按全局规则只能用 James 的 Chrome profile;选不中就停,让用户开 |

## 7. 还没做的

待办在 `log.md` 的 frontmatter `milestones` 里。接新需求前先看一眼。
