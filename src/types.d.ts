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

type EvaluateParams = {
  githubUsername: string
  githubRepositoryName: string
  resultsFile: EvaluationTestFile
  requirementsFile: RequirementsFile
  resultPath: string
}

type EvaluationResult = {
  github_username: string
  github_repository_name: string
  evaluations: {
    description: string
    grade: number
  }[]
}
