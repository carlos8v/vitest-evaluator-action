import { readFileSync } from 'fs'

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
    const evaluationResult = evaluatorService.evaluateRepository({
      githubRepositoryName,
      githubUsername,
      resultsFile: JSON.parse(testOuputFile) as EvaluationTestFile,
      requirementsFile: JSON.parse(requirementsFile) as RequirementsFile,
      resultPath: process.argv[4]
    })

    const feedbackMessage = githubService.createFeedbackMessage(evaluationResult)
    await githubService.createEvaluatorFeedback(feedbackMessage)

    process.exit(0)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}

run()
