import { resolve } from 'path'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'

import { describe, it, expect } from 'vitest'

describe('Test evaluator results', () => {
  it('Should match correct result file', () => {    
    const entrypointFile = resolve(__dirname, '..', 'evaluator.ts')

    const testOutputFile = resolve(__dirname, 'test-output.json')
    const requirementsFile = resolve(__dirname, 'requirements.json')
    const resultFile = resolve(__dirname, 'result.json')

    execSync(`ts-node-dev --transpile-only ${entrypointFile} ${testOutputFile} ${requirementsFile} ${resultFile}`)

    const expectedResultJson = {
      github_username: 'no_actor',
      github_repository_name: 'no_repository',
      evaluations: [{
        description: 'First test describe',
        grade: 1,
      }, {
        description: 'Second test describe',
        grade: 0,
      }]
    }

    const evaluationFileContent = readFileSync(resultFile, { encoding: 'utf8' })
    const resultJson = JSON.parse(evaluationFileContent)

    expect(resultJson).toMatchObject(expectedResultJson)
  })
})
