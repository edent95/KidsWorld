// 网站检查(CI 的 ci 检查跑它;本机 `npm run check`)。零依赖,只读仓库,不改任何文件。
//
// 查什么:
//   1. 每个页面有 <html lang>、<title>、viewport
//   2. 页面里引用的本地文件(src / href / srcset)都存在 —— 改名、删图后忘了改页面会在这里挂
//   3. 每个 <use href="#x"> 在同一页里都有 id="x" 的 symbol —— 图标缺了浏览器只会静默空白
//   4. 页面里的图标 sprite 与 scripts/icons.mjs 的生成结果一致(在临时目录里跑生成器再比,不碰仓库)
//   5. CNAME 还指着 kidsworld-penang.com
// 不查什么:外部链接能不能打开、视觉效果、对比度(看 /design 的对比度图)、拼写。
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SKIP_DIRS = new Set(['.git', '.worktrees', 'node_modules', 'logs', 'untitled folder'])
const errors = []
const fail = (msg) => errors.push(msg)

function htmlPages(dir = ROOT) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...htmlPages(p))
    else if (name.endsWith('.html') && name !== 'home.html') out.push(p)
  }
  return out
}

const pages = htmlPages()
if (!pages.length) fail('找不到任何 .html 页面')

const SPRITE = /<!--icons:start-->([\s\S]*?)<!--icons:end-->/
for (const page of pages) {
  const rel = relative(ROOT, page)
  const html = readFileSync(page, 'utf8')

  // 1. 基本结构
  if (!/<html[^>]*\blang="[^"]+"/.test(html)) fail(`${rel}: <html> 缺 lang`)
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${rel}: 缺 <title>`)
  if (!/<meta name="viewport"/.test(html)) fail(`${rel}: 缺 viewport meta`)

  // 2. 本地文件引用
  const refs = new Set()
  for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) refs.add(m[1])
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0])
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/|javascript:)/i.test(ref) || ref.includes('${')) continue
    const clean = decodeURI(ref.split(/[?#]/)[0])
    if (!clean) continue
    let target = clean.startsWith('/') ? join(ROOT, clean) : resolve(dirname(page), clean)
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html')
    if (!existsSync(target)) fail(`${rel}: 引用的本地文件不存在 → ${ref}`)
  }

  // 3. <use href="#x"> 都有对应 id
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  for (const m of html.matchAll(/<use[^>]*\shref="#([^"]+)"/g)) if (!m[1].includes('${') && !ids.has(m[1])) fail(`${rel}: <use href="#${m[1]}"> 找不到对应的 symbol`)
}

// 4. 图标 sprite 与生成器一致:在临时目录复刻页面 + 脚本,跑生成器,再比 sprite 段
const gen = join(ROOT, 'scripts/icons.mjs')
if (existsSync(gen)) {
  const tmp = mkdtempSync(join(tmpdir(), 'kw-icons-'))
  try {
    mkdirSync(join(tmp, 'scripts'))
    cpSync(gen, join(tmp, 'scripts/icons.mjs'))
    const withSprite = pages.filter((p) => SPRITE.test(readFileSync(p, 'utf8')))
    for (const p of withSprite) {
      const dest = join(tmp, relative(ROOT, p))
      mkdirSync(dirname(dest), { recursive: true })
      cpSync(p, dest)
    }
    execFileSync(process.execPath, [join(tmp, 'scripts/icons.mjs')], { stdio: 'pipe' })
    for (const p of withSprite) {
      const want = readFileSync(join(tmp, relative(ROOT, p)), 'utf8').match(SPRITE)[1]
      const have = readFileSync(p, 'utf8').match(SPRITE)[1]
      if (want !== have) fail(`${relative(ROOT, p)}: 图标 sprite 和 scripts/icons.mjs 生成的不一致 —— 改图标要改脚本再跑 npm run icons,不要手改页面`)
    }
  } catch (e) {
    fail(`跑 scripts/icons.mjs 失败:${(e.stderr || e.message || '').toString().trim().split('\n').slice(-3).join(' / ')}`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

// 5. 自定域名
const cname = existsSync(join(ROOT, 'CNAME')) ? readFileSync(join(ROOT, 'CNAME'), 'utf8').trim() : ''
if (cname !== 'kidsworld-penang.com') fail(`CNAME 应为 kidsworld-penang.com,现在是「${cname || '(缺)'}」—— 改了会让网站域名失效`)

if (errors.length) {
  console.error(`✗ 网站检查没过(${errors.length} 项):`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log(`✓ 网站检查通过:${pages.length} 个页面,本地引用、图标、sprite、CNAME 都正常`)
