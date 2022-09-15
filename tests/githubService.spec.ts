import { resolve } from 'path'
import { readFileSync } from 'fs'

import { describe, it, expect, vi } from 'vitest'

import githubServiceFactory from '../src/githubService'

describe('Test github service feedback', () => {
  const resultFile = resolve(__dirname, 'test-result.json')
  const result = JSON.parse(readFileSync(resultFile, { encoding: 'utf8' })) as EvaluationResult

  it('should return correct evaluation values', () => {
    const githubService = githubServiceFactory()
    const feedbackMessage = githubService.createFeedbackMessage(result)

    expect(feedbackMessage).toContain('Insuficiente')
    expect(feedbackMessage).toContain('50.00%')
    expect(feedbackMessage).toContain('First test describe')
    expect(feedbackMessage).toContain('Second test describe')
  })

  it('should pass if minimum pass grade is lower than evaluation result percentage', () => {
    const githubService = githubServiceFactory(50)
    const feedbackMessage = githubService.createFeedbackMessage(result)

    expect(feedbackMessage).toContain('Suficiente')
    expect(feedbackMessage).toContain('50.00%')
  })

  it('should fail if minimum pass grade is higher than evaluation result percentage', () => {
    const githubService = githubServiceFactory()
    const feedbackMessage = githubService.createFeedbackMessage(result)

    expect(feedbackMessage).toContain('Insuficiente')
    expect(feedbackMessage).toContain('50.00%')
  })
})
