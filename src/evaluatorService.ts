import { createHash } from 'crypto'

const MIN_PERCENTAGE_TO_APPROVE = Number(process.env.MIN_PERCENTAGE_TO_APPROVE || 70)

const hash = (description: string) => createHash('md5').update(description).digest('hex')

export default () => ({
  evaluateRepository: (params: EvaluateParams): EvaluationResult => {
    const { testResults } = params.resultsFile
    const { requirements } = params.requirementsFile
    const { minPassingGrade = MIN_PERCENTAGE_TO_APPROVE } = params

    const requirementsWithId = requirements.map(({ description, bonus = false }) => ({
      id: hash(description),
      description,
      bonus
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

    const evaluations: EvaluationResult['evaluations'] =
      requirementsWithId.map(({ id, description, ...rest }) => ({
        ...rest,
        description,
        grade: requirementsStatusById.get(id) === 'passed' ? 'passed' : 'failed'
      }))

    const requiredRequirements = evaluations.filter(({ bonus = false }) => bonus === false)

    const requiredApprovedRequirements = requiredRequirements.reduce((acc, { grade }) => grade === 'passed' ? acc + 1 : acc, 0)
    const allApprovedRequirements = evaluations.reduce((acc, { grade }) => grade === 'passed' ? acc + 1 : acc, 0)

    const requiredGradePercentage = (requiredApprovedRequirements / requiredRequirements.length) * 100
    const allGradePercentage = (allApprovedRequirements / evaluations.length) * 100

    return {
      githubUsername: params.githubUsername,
      githubRepositoryName: params.githubRepositoryName,
      status: requiredGradePercentage >= minPassingGrade ? 'passed' : 'failed',
      requiredPercentage: Number(requiredGradePercentage.toFixed(2)),
      allPercentage: Number(allGradePercentage.toFixed(2)),
      evaluations
    }
  }
})
