---
project: kidsworld
title: 小乐儿园地 Kids World 网站
status: in-progress
version: 0.1.0
updated: 2026-11-24
progress: 60
priority: medium
tags: [static-site, github-pages, html, css, brand]
log_format: rag-v1
links:
  repo: https://github.com/edent95/KidsWorld
  ui: https://kidsworld-penang.com/
milestones:
  - { name: "首页小字改用规范里的文字色(草绿、天蓝字对比度不足)", done: false }
  - { name: "课程分班与一天作息换成园方真实内容(现在是示意)", done: false }
  - { name: "Facebook 最新照片补进照片墙(要用 James 的 Chrome)", done: false }
---

# 小乐儿园地 Kids World 网站 开发日志

## 格式约定 (rag-v1)

> 这一节位于第一条 `## YYYY-MM-DD` 之前。解析器只从**第一个以完整日期开头的二级标题**
> 开始切条目,因此这段内容对解析器不可见,只服务于读原文的人和 agent。

**这份 log 是写给检索的,不是写给连读的。** 每条 `###` 条目都是一个独立的 RAG chunk,
被单独召回时必须自解释 —— 所以每条都重复主语、不使用「它/上述/前面那个」这类指代。

每条条目必填五栏(加标题),另有两栏可选:

| 栏 | 回答什么 | 怎么写 |
|---|---|---|
| 标题 | 这条是什么 | `类型(范围): 结论先行的一句话`;类型用 `feat` `fix` `refactor` `ui` `perf` `docs` `config` `chore` `data` |
| `why` | **为什么改** —— 用户要的?撞上了什么?选了 A 没选 B 的理由 | 一两句;代码与 diff 里读不出的那部分 |
| `ripples` | **牵连到了什么** —— 谁的假设因此失效、以后必须一起改的东西 | 写清耦合方向;答不出写「无」,不许留空 |
| `verified` | 凭什么说这条是成立的 | 跑了什么命令、看到了什么 |
| `keywords` | 检索词,中英并列 | 逗号分隔;写别人会拿来搜的词 |
| `learned` | **学到了什么、该去哪**:每条以去处标签开头 | 没有就写「无」,不许留空 |
| `what`(可选) | diff 里**看不出**的做法要点 | 最多三句;不抄 diff、不列文件清单 |
| `related`(可选) | 关联条目 ID | `E-…` |

条目 ID 由 `npm run log:append` 分配,一经写下不再变更。本仓库有 `logs/entries/`,
新条目一条一个文件写在那里,这个文件只放 frontmatter 与格式约定。

**追加条目必须用 `npm run log:append`。** 不要「读整个文件 → 拼接 → 整文件写回」。

---
