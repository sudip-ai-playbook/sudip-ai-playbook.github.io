#!/usr/bin/env node
/**
 * Dump ConsultAI OS TypeScript data to JSON for Python Excel export.
 * Usage: node --experimental-strip-types scripts/dump_consulting_os.mjs
 *    or: npx tsx scripts/dump_consulting_os.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataModule = join(root, 'app/src/data/consultingOs.ts')

const {
  CONSULTING_STAGES,
  BUSINESS_SITUATIONS,
  FRAMEWORK_RECOMMENDATIONS,
  CONSULTING_OS_META,
  MVP_FRAMEWORKS,
} = await import(pathToFileURL(dataModule).href)

const outDir = join(root, 'app/src/data')
writeFileSync(
  join(outDir, 'consultingOs.stages.json'),
  `${JSON.stringify(CONSULTING_STAGES, null, 2)}\n`,
)
writeFileSync(
  join(outDir, 'consultingOs.situations.json'),
  `${JSON.stringify(BUSINESS_SITUATIONS, null, 2)}\n`,
)
writeFileSync(
  join(outDir, 'consultingOs.meta.json'),
  `${JSON.stringify(
    {
      meta: CONSULTING_OS_META,
      frameworkRecommendations: FRAMEWORK_RECOMMENDATIONS,
      mvpFrameworks: MVP_FRAMEWORKS,
    },
    null,
    2,
  )}\n`,
)

console.log('Wrote consulting OS JSON sidecars to', outDir)
