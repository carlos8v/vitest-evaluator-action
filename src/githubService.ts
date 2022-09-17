import * as github from '@actions/github'

export default () => ({
  createFeedbackMessage: (params: EvaluationResult) => {
    const { status, requiredPercentage, allPercentage, evaluations } = params

    return `### Resultado do projeto
| Item |   |
|:-----|:-:|
| Desempenho | ${status === 'passed' ? 'Suficiente' : 'Insuficiente'} |
| Percentual de cumprimento de requisitos obrigatórios | ${requiredPercentage.toFixed(2)}% |
| Percentual de cumprimento de requisitos totais | ${allPercentage.toFixed(2)}% |

### Resultado por requisito
| Descrição | Avaliação |
|:------------|:-----------:|
${evaluations.reduce((acc, { description, grade }) => {
  const gradeResult = grade === 'passed' ? ':heavy_check_mark:' : ':heavy_multiplication_x:'
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
