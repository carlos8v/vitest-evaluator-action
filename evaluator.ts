import { readFileSync, writeFileSync } from 'fs'

type RequirementsFile = {
  requirements: {
    description: string
  }[]
}

type EvaluationTestFile = {
  testResults: {
    assertionResults: {
      ancestorTitles: string[]
      fullName: string
      status: 'passed' | 'failed'
      title: string
    }[]
  }[]
}

type EvaluationOutput = {
  [describe: string]: 'passed' | 'failed'
}

const CORRECT_ANSWER_GRADE = 1
const WRONG_ANSWER_GRADE = 0

const githubUsername = process.env.GITHUB_ACTOR || 'no_actor'
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository'

const testOuputFile = readFileSync(process.argv[2], { encoding: 'utf8' })
const { testResults } = JSON.parse(testOuputFile) as EvaluationTestFile

const requirementsFile = readFileSync(process.argv[3], { encoding: 'utf8' })
const { requirements } = JSON.parse(requirementsFile) as RequirementsFile

const evaluationsByRequirements =
  testResults.map(({ assertionResults }) => (
    assertionResults.map(({ ancestorTitles, status }) => ({
      describe: ancestorTitles[ancestorTitles.length - 1],
      status
    }))
  )).flat()
    .reduce((acc, evaluation) => {
      const status = acc[evaluation.describe]
      const currentStatus = evaluation.status
      if (!status || currentStatus === 'failed') {
        acc[evaluation.describe] = currentStatus
        return acc
      }
      return acc
    }, {} as EvaluationOutput)

const evaluations =
    requirements.map(({ description }) => ({
      description,
      grade: (evaluationsByRequirements[description] === 'passed') ? CORRECT_ANSWER_GRADE : WRONG_ANSWER_GRADE
    }))


writeFileSync(process.argv[4], JSON.stringify({
  github_username: githubUsername,
  github_repository_name: githubRepositoryName,
  evaluations: [...evaluations]
}))

process.exit(0)
