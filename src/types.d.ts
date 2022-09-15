type RequirementsFile = {
  requirements: {
    description: string
    bonus?: boolean
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
}

type EvaluationResult = {
  github_username: string
  github_repository_name: string
  evaluations: {
    description: string
    bonus: boolean
    grade: number
  }[]
}
