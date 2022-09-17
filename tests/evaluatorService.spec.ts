import { resolve } from 'path'
import { readFileSync } from 'fs'

import { describe, it, expect } from 'vitest'

import evaluatorServiceFactory from '../src/evaluatorService'

describe('Test evaluator service results', () => {
  const testOutputFile = resolve(__dirname, 'test-output.json')
  const requirementsFile = resolve(__dirname, 'requirements.json')

  const evaluatorService = evaluatorServiceFactory()

  it('Should match correct result file on success', () => {
    const result = evaluatorService.evaluateRepository({
      githubUsername: 'no_actor',
      githubRepositoryName: 'no_repository',
      resultsFile: JSON.parse(readFileSync(testOutputFile, { encoding: 'utf8' })) as EvaluationTestFile,
      requirementsFile: JSON.parse(readFileSync(requirementsFile, { encoding: 'utf8' })) as RequirementsFile
    })

    const expectedResult = {
      githubUsername: 'no_actor',
      githubRepositoryName: 'no_repository',
      status: 'failed',
      requiredPercentage: 50,
      allPercentage: 66.67,
      evaluations: [{
        description: 'First test describe',
        bonus: false,
        grade: 'passed',
      }, {
        description: 'Second test describe',
        bonus: false,
        grade: 'failed',
      }, {
        description: 'Third test describe',
        bonus: true,
        grade: 'passed'
      }]
    }

    expect(result).toMatchObject(expectedResult)
  })

  it('Should match correct result file on error', () => {
    const result = evaluatorService.evaluateRepository({
      githubUsername: 'no_actor',
      githubRepositoryName: 'no_repository',
      resultsFile: JSON.parse(readFileSync(testOutputFile, { encoding: 'utf8' })) as EvaluationTestFile,
      requirementsFile: JSON.parse(readFileSync(requirementsFile, { encoding: 'utf8' })) as RequirementsFile,
      minPassingGrade: 50
    })

    const expectedResult = {
      githubUsername: 'no_actor',
      githubRepositoryName: 'no_repository',
      status: 'passed',
      requiredPercentage: 50,
      allPercentage: 66.67,
      evaluations: [{
        description: 'First test describe',
        bonus: false,
        grade: 'passed',
      }, {
        description: 'Second test describe',
        bonus: false,
        grade: 'failed',
      }, {
        description: 'Third test describe',
        bonus: true,
        grade: 'passed'
      }]
    }

    expect(result).toMatchObject(expectedResult)
  })
})
