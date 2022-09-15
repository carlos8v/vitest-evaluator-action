import { resolve } from 'path'
import { readFileSync } from 'fs'

import { describe, it, expect } from 'vitest'

import evaluatorServiceFactory from '../src/evaluatorService'

describe('Test evaluator service results', () => {
  it('Should match correct result file', () => {
    const testOutputFile = resolve(__dirname, 'test-output.json')
    const requirementsFile = resolve(__dirname, 'requirements.json')
    const resultFile = resolve(__dirname, 'result.json')

    const evaluatorService = evaluatorServiceFactory()

    const result = evaluatorService.evaluateRepository({
      githubUsername: 'no_actor',
      githubRepositoryName: 'no_repository',
      resultsFile: JSON.parse(readFileSync(testOutputFile, { encoding: 'utf8' })) as EvaluationTestFile,
      requirementsFile: JSON.parse(readFileSync(requirementsFile, { encoding: 'utf8' })) as RequirementsFile,
      resultPath: resultFile
    })

    const expectedResult = {
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

    expect(result).toMatchObject(expectedResult)
  })
})
