import { readFileSync } from 'fs'

import { setFailed } from '@actions/core'

const githubUsername = process.env.GITHUB_ACTOR || 'no_actor'
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository'

const testOuputFile = readFileSync(process.argv[2], { encoding: 'utf8' })
const requirementsFile = readFileSync(process.argv[3], { encoding: 'utf8' })

import evaluatorServiceFactory from './evaluatorService'
import githubServiceFactory from './githubService'

async function run() {
   const evaluatorService = evaluatorServiceFactory()
  const githubService = githubServiceFactory()

  try {
    const protectedFiles = ['.github/workflows/test.yml', '.evaluator/requirements.json']
    if (await githubService.hasInvalidChanges(protectedFiles)) {
      throw new Error('Protected files cannot be modified')
    }

    const evaluationResult = evaluatorService.evaluateRepository({
      githubRepositoryName,
      githubUsername,
      resultsFile: JSON.parse(testOuputFile) as EvaluationTestFile,
      requirementsFile: JSON.parse(requirementsFile) as RequirementsFile
    })

    const feedbackMessage = githubService.createFeedbackMessage(evaluationResult)
    await githubService.createEvaluatorFeedback(feedbackMessage)    

    process.exit(evaluationResult.status === 'passed' ? 0 : 1)
  } catch(err: Error | any) {
    setFailed(err?.message || 'Action failed with internal error')
    process.exit(1)
  }
}

run()
