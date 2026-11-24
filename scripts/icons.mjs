// 黄金圆图标 · 极简画法(同 personal-dashboard client/src/lib/goldenIcons.ts 的规则)
// - 24 格;辅助线 G1 = 24/φ²、G2 = 24/φ;所有半径只取 R(k) = 9·φ⁻ᵏ;只用直线和圆弧,不用贝塞尔。
// - 骨架一律 1px 细线(跟文字同色、淡一层),每个图标只有一个彩色焦点(颜色取 CSS 变量 --f)。
// 用法:node scripts/icons.mjs  → 把 <symbol> 写进 index.html 与 design/index.html 的 <!--icons:start--> … <!--icons:end--> 之间。
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PHI = (1 + Math.sqrt(5)) / 2
const G1 = 24 / PHI ** 2, G2 = 24 / PHI
const R = (k) => 9 / PHI ** k
const [R_1, R0, R1, R2, R3, R4] = [R(-1), R(0), R(1), R(2), R(3), R(4)]
const n = (v) => String(+v.toFixed(3))
const polar = (c, r, deg) => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)]
const P = (p) => `${n(p[0])} ${n(p[1])}`
const A = (r, to, sweep = 1, large = 0) => `A${n(r)} ${n(r)} 0 ${large} ${sweep} ${P(to)}`
const arc = (c, r, a0, a1) => `M${P(polar(c, r, a0))} ${A(r, polar(c, r, a1), a1 > a0 ? 1 : 0, Math.abs(a1 - a0) > 180 ? 1 : 0)}`

const LINE = 'fill="none" stroke="currentColor" stroke-opacity=".72" stroke-width="1" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"'
const m = (d) => `<path ${LINE} d="${d}"/>`
const circle = (c, r) => `<circle ${LINE} cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}"/>`
const rect = (x, y, w, h, rx = 0) => `<rect ${LINE} x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${n(rx)}"` : ''}/>`
const dot = (c, r) => `<circle fill="currentColor" fill-opacity=".5" cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}"/>`
const focus = (c, r = R3) => `<circle fill="var(--f, currentColor)" cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}"/>`
const C = [12, 12]

const ICONS = {
  // 日历:页面 3..21,顶栏在 G1,两只环落在 G1 / G2 两条辅助线上;焦点 = 圈起来的那一天
  calendar: rect(3, 5, 18, 16, R3) + m(`M3 ${n(G1)} H21 M${n(G1)} 3 V7 M${n(G2)} 3 V7`) + dot([G1 - 2, G2], R4) + dot([12, G2], R4) + focus([G2 + 2, G2], R3),
  // 对话泡:圆角 R2,尾巴落在 G1;三个点,中间那个是焦点 —— 语言
  speech: m(`M${n(3 + R2)} 4 H${n(21 - R2)} ${A(R2, [21, 4 + R2])} V${n(16.5 - R2)} ${A(R2, [21 - R2, 16.5])} H${n(G1 + 2)} L${n(G1 - 2)} 20.5 V16.5 H${n(3 + R2)} ${A(R2, [3, 16.5 - R2])} V${n(4 + R2)} ${A(R2, [3 + R2, 4])} Z`)
    + dot([12 - R1 + 1, 10.25], R4) + dot([12 + R1 - 1, 10.25], R4) + focus([12, 10.25], R3),
  // 调色盘:盘面 R0,拇指孔 R3 在 G2;三滴颜料 + 一滴焦点
  palette: circle(C, R0) + circle([G2 + 0.5, G2 + 0.5], R3) + dot(polar(C, R1, 200), R4 + 0.4) + dot(polar(C, R1, 250), R4 + 0.4) + dot(polar(C, R1, 300), R4 + 0.4) + focus(polar(C, R1, 145), R3),
  // 音符:两个符头 R2,符干与符杠是直线;焦点在第一个符头里
  note: circle([7.5, 17.5], R2) + circle([16.5, 15.5], R2) + m(`M${n(7.5 + R2)} 17.5 V5.5 L${n(16.5 + R2)} 3.5 V15.5 M${n(7.5 + R2)} ${n(5.5 + R2)} L${n(16.5 + R2)} ${n(3.5 + R2)}`) + focus([7.5, 17.5], R3),
  // 灯笼:灯身圆角 R2,上盖、提手、流苏都是直线;焦点 = 灯芯
  lantern: rect(5.5, 6.5, 13, 11, R2) + m(`M${n(G1)} 6.5 V4.5 H${n(G2)} V6.5 M12 4.5 V2.5 M12 17.5 V21 M${n(G1)} 17.5 V19 M${n(G2)} 17.5 V19 M12 6.5 V17.5`) + m(arc([12 - R0 + 1.5, 12], R0 - 3, -32, 32) + ' ' + arc([12 + R0 - 1.5, 12], R0 - 3, 148, 212)) + focus(C, R3),
  // 树:树冠 R1 圆心在 G1,树干直线落地;焦点 = 树上一颗果子
  tree: circle([12, G1], R1) + m(`M12 ${n(G1 + R1)} V21 M5 21 H19 M12 ${n(G2 + 1)} L${n(12 + R2)} ${n(G2 - 1.5)}`) + focus(polar([12, G1], R2, -45), R3),
  // 积木:两块落地、一块叠上去,圆角 R4;焦点在顶上那块
  blocks: rect(3, 13, 8, 8, R4) + rect(13, 13, 8, 8, R4) + rect(8, 4, 8, 8, R4) + dot([7, 17], R4) + dot([17, 17], R4) + focus([12, 8], R3),
  // 心:两瓣 R2 圆弧相切于正中,切线收到底尖;焦点在心口
  heart: (() => {
    const c1 = [12 - R2, 9], c2 = [12 + R2, 9], a = polar(c1, R2, 135), b = polar(c2, R2, 45)
    const tip = [12, a[1] + (12 - a[0])]
    return m(`M${P(a)} ${A(R2, [12, 9], 1, 1)} ${A(R2, b, 1, 1)} L${P(tip)} Z`) + focus([12, 11.8], R3)
  })(),
  // 太阳:日轮 R2,八道光从 R1 到 R0;焦点 = 日心
  sun: circle(C, R2) + m([0, 45, 90, 135, 180, 225, 270, 315].map((d) => `M${P(polar(C, R1, d))} L${P(polar(C, R0, d))}`).join(' ')) + focus(C, R3),
  // 苹果:果身 R1,果柄直线,叶子两段 R2 圆弧;焦点 = 高光
  apple: circle([12, 13.5], R1) + m(`M12 ${n(13.5 - R1)} V4.5`) + m(`M12 6 ${A(R2, [16, 4])} ${A(R2, [12, 6])}`) + focus(polar([12, 13.5], R2, 225), R3),
  // 饭碗:碗 = 半径 R0 的下半圆,饭堆 = R1 的上半圆,筷子两条直线;焦点 = 饭粒
  bowl: m(`M3 12 H21 ${A(R0, [3, 12])} Z`) + m(arc([12, 12], R1, 180, 360)) + m(`M14 3 L19.5 9 M16 2.5 L21 8`) + focus([12 - R2 + 1, 12 - R2 + 0.5], R3),
  // 房子:屋顶两条直线,屋身圆角 R4,门 rx R3;焦点 = 窗
  house: m(`M3 11.5 L12 3.5 L21 11.5`) + rect(5.5, 9.5, 13, 11.5, R4) + rect(G1, 14.5, 12 - G1 + 1.5, 6.5, R4) + focus([G2 + 1, 13.5], R3),
  // 书:上下页边是 R(−1) 的圆弧(同面板 book);焦点在右页
  book: m(`M12 7.5 ${A(R_1, [3, 5], 0)} V18 ${A(R_1, [12, 20.5], 1)} Z M12 7.5 ${A(R_1, [21, 5], 1)} V18 ${A(R_1, [12, 20.5], 0)} Z M12 7.5 V20.5`) + focus([G2 + 1.5, 12.5], R3),
  // 定位:圆顶 R1 + 两条切线收尖;焦点在中心
  pin: (() => {
    const c = [12, G1 + 0.5], a = polar(c, R1, 150), b = polar(c, R1, 30)
    return m(`M${P(a)} ${A(R1, b, 1, 1)} L12 21 Z`) + focus(c, R3)
  })(),
  // 电话:话筒(圆角 R3 的竖条)+ 听筒孔;焦点 = 按键
  phone: rect(7, 2.5, 10, 19, R3) + m(`M${n(G1 + 1)} 5 H${n(G2 - 1)}`) + focus([12, 18.5], R4 + 0.3),
  // 钟:表盘 R0,分针 R1、时针 R2(同面板 now);焦点 = 轴心
  clock: circle(C, R0) + m(`M12 12 V${n(12 - R1)} M12 12 H${n(12 + R2)}`) + focus(C, R3),
  // 月亮:外圆 R0 被圆心偏到右上、半径 R1 的圆咬掉一口(两圆交点精确算出);焦点 = 缺口里的一颗星
  moon: (() => {
    const c2 = [12 + R2 + 1, 12 - R2 - 1]
    const dx = c2[0] - 12, dy = c2[1] - 12, d = Math.hypot(dx, dy)
    const x = (d * d + R0 * R0 - R1 * R1) / (2 * d), h = Math.sqrt(R0 * R0 - x * x)
    const mx = 12 + (dx * x) / d, my = 12 + (dy * x) / d
    const i1 = [mx + (dy * h) / d, my - (dx * h) / d], i2 = [mx - (dy * h) / d, my + (dx * h) / d]
    return m(`M${P(i1)} ${A(R0, i2, 0, 1)} ${A(R1, i1, 1, 0)} Z`) + focus([c2[0] + R4, c2[1] - R4], R3)
  })(),
  // 聊天(Facebook 私讯):对话泡 + 一道折线闪电
  chat: circle([12, 11.5], R0) + m(`M${n(12 - R0 * 0.62)} ${n(11.5 + R0 * 0.78)} L6.5 21 L${n(12 - R0 * 0.2)} ${n(11.5 + R0 * 0.98)} M7.5 13.5 L10.5 10 L13 12.5 L16.5 9.5`) + focus([16.5, 9.5], R4 + 0.3),
}

const symbols = Object.entries(ICONS).map(([id, body]) => `  <symbol id="i-${id}" viewBox="0 0 24 24">${body}</symbol>`).join('\n')
const re = /<!--icons:start-->[\s\S]*?<!--icons:end-->/
for (const page of ['../index.html', '../design/index.html']) {
  const file = fileURLToPath(new URL(page, import.meta.url))
  const html = readFileSync(file, 'utf8')
  if (!re.test(html)) throw new Error(`${page} 缺少 <!--icons:start--> … <!--icons:end--> 标记`)
  writeFileSync(file, html.replace(re, `<!--icons:start-->\n${symbols}\n  <!--icons:end-->`))
}
console.log(`wrote ${Object.keys(ICONS).length} icons into 2 pages`)
