import { info } from '@actions/core'
import { getOctokit, context } from '@actions/github'

export default () => ({
  hasInvalidChanges: async (protectedFiles: string[]) => {
    const token = process.env.TOKEN!
    const octokit = getOctokit(token)
    const { owner, repo } = context.issue
    info(`JSON.stringify(context.payload), ${context.ref}, ${context.sha}`)

    const base = context.ref
    const head = context.sha

    const response = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${base}...${head}`
    })

    return response.data.files
      ?.filter((file) => file.status === 'modified')
      ?.some((file) => protectedFiles.includes(file.filename)) || false
  },
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
    const octokit = getOctokit(token)
    const { owner, repo, number } = context.issue

    await octokit.rest.issues.createComment({
      issue_number: number,
      owner,
      repo,
      body: feedback
    })
  }
})
