type EvaluationOutput = {
  [describe: string]: 'passed' | 'failed'
}

const CORRECT_ANSWER_GRADE = 1
const WRONG_ANSWER_GRADE = 0

export default () => ({
  evaluateRepository: (params: EvaluateParams): EvaluationResult => {
    const { testResults } = params.resultsFile
    const { requirements } = params.requirementsFile

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


    return {
      github_username: params.githubUsername,
      github_repository_name: params.githubRepositoryName,
      evaluations: [...evaluations]
    }
  }
})
