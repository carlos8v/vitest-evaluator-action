import * as github from '@actions/github'

const MIN_PERCENTAGE_TO_APPROVE = Number(process.env.MIN_PERCENTAGE_TO_APPROVE || 70)
const MIN_GRADE_TO_APPROVE = 1

export default (minPassingGrade: number = MIN_PERCENTAGE_TO_APPROVE) => ({
  createFeedbackMessage: ({ evaluations }: EvaluationResult) => {
    const approvedRequirements = evaluations.reduce((acc, { grade }) => grade >= MIN_GRADE_TO_APPROVE ? acc + 1 : acc, 0)
    const gradePercentage = (approvedRequirements / evaluations.length) * 100
  
    return `### Resultado do projeto
| Item |   |
|:-----|:-:|
| Desempenho | ${gradePercentage >= minPassingGrade ? 'Suficiente' : 'Insuficiente'} |
| Percentual de cumprimento de requisitos | ${gradePercentage.toFixed(2)}% |


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
