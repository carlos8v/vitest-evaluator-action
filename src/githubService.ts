import * as github from '@actions/github'

const MIN_GRADE_TO_APPROVE = 1
const MIN_PERCENTAGE_TO_APPROVE = Number(process.env.MIN_PERCENTAGE_TO_APPROVE || 70)

export default (minPassingGrade: number = MIN_PERCENTAGE_TO_APPROVE) => ({
  createFeedbackMessage: ({ evaluations }: EvaluationResult) => {
    const requiredRequirements = evaluations.filter(({ bonus = false }) => bonus === false)

    const requiredApprovedRequirements = requiredRequirements.reduce((acc, { grade }) => grade >= MIN_GRADE_TO_APPROVE ? acc + 1 : acc, 0)
    const allApprovedRequirements = evaluations.reduce((acc, { grade }) => grade >= MIN_GRADE_TO_APPROVE ? acc + 1 : acc, 0)

    const requiredGradePercentage = (requiredApprovedRequirements / requiredRequirements.length) * 100
    const allGradePercentage = (allApprovedRequirements / evaluations.length) * 100
  
    return `### Resultado do projeto
| Item |   |
|:-----|:-:|
| Desempenho | ${requiredGradePercentage >= minPassingGrade ? 'Suficiente' : 'Insuficiente'} |
| Percentual de cumprimento de requisitos obrigatórios | ${requiredGradePercentage.toFixed(2)}% |
| Percentual de cumprimento de requisitos totais | ${allGradePercentage.toFixed(2)}% |


### Resultado por requisito
| Descrição | Avaliação |
|:------------|:-----------:|
${evaluations.reduce((acc, { description, grade }) => {
  const gradeResult = grade >= MIN_GRADE_TO_APPROVE ? ':heavy_check_mark:' : ':heavy_multiplication_x:'
  return `${acc}| ${description} | ${gradeResult} |\n`
}, '')}`
  },
  createEvaluatorFeedback: async (feedback: string) => {
    const token = process.env.TOKEN!
    const octokit = github.getOctokit(token)
    const { owner, repo, number } = github.context.issue

    await octokit.rest.issues.createComment({
      issue_number: number,
      owner,
      repo,
      body: feedback
    })
  }
})
