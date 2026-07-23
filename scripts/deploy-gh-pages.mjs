import { execSync } from 'node:child_process'
import { mkdtempSync, rmSync, cpSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const remote =
  process.env.PAGES_REMOTE ||
  'https://github.com/kaixinmai/shanxi.git'
const branch = 'gh-pages'
const siteUrl = 'https://kaixinmai.github.io/shanxi/'
const work = mkdtempSync(join(tmpdir(), 'gh-pages-'))

function git(args) {
  execSync(`git ${args}`, { cwd: work, stdio: 'inherit' })
}

try {
  cpSync(distDir, work, { recursive: true })
  writeFileSync(join(work, '.nojekyll'), '')
  git('init')
  git(`checkout -b ${branch}`)
  git('add -A')
  git('commit -m "Deploy GitHub Pages"')
  git(`remote add origin ${remote}`)
  git(`push -f origin ${branch}`)
  console.log(`\nPushed to ${remote} (${branch})`)
  console.log(`Site: ${siteUrl}`)
} finally {
  rmSync(work, { recursive: true, force: true })
}
