import { createHash } from 'crypto'

const CORRECT_ANSWER_GRADE = 1
const WRONG_ANSWER_GRADE = 0

const hash = (description: string) => createHash('md5').update(description).digest('hex')

export default () => ({
  evaluateRepository: (params: EvaluateParams): EvaluationResult => {
    const { testResults } = params.resultsFile
    const { requirements } = params.requirementsFile

    const requirementsWithId = requirements.map(({ description }) => ({
      id: hash(description),
      description
    }))

    const requirementsStatusById =
      testResults.map(({ assertionResults }) => (
        assertionResults.map(({ ancestorTitles, status }) => ({
          id: hash(ancestorTitles[ancestorTitles.length - 1]),
          describe: ancestorTitles[ancestorTitles.length - 1],
          status
        }))
      )).flat()
        .reduce((acc, evaluation) => {
          if (acc.get(evaluation.id) === 'failed') return acc

          acc.set(evaluation.id, evaluation.status)
          return acc
        }, new Map())

    const evaluations =
      requirementsWithId.map(({ id, description }) => ({
        description,
        grade: requirementsStatusById.get(id) === 'passed'
          ? CORRECT_ANSWER_GRADE
          : WRONG_ANSWER_GRADE
      }))

    return {
      github_username: params.githubUsername,
      github_repository_name: params.githubRepositoryName,
      evaluations: [...evaluations]
    }
  }
})
