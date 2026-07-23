import { execSync } from 'node:child_process'
import { mkdtempSync, rmSync, cpSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const remote =
  process.env.GITEE_PAGES_REMOTE ||
  'https://gitee.com/yanwei26/shanxi-project.git'
const branch = 'gh-pages'
const work = mkdtempSync(join(tmpdir(), 'gitee-pages-'))

function git(args) {
  execSync(`git ${args}`, { cwd: work, stdio: 'inherit' })
}

try {
  cpSync(distDir, work, { recursive: true })
  writeFileSync(join(work, '.nojekyll'), '')
  git('init')
  git(`checkout -b ${branch}`)
  git('add -A')
  git('commit -m "Deploy Gitee Pages"')
  git(`remote add origin ${remote}`)
  git(`push -f origin ${branch}`)
  console.log(`\nPushed to ${remote} (${branch})`)
  console.log('Site: https://yanwei26.gitee.io/shanxi-project/')
} finally {
  rmSync(work, { recursive: true, force: true })
}
