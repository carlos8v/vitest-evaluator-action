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
  minPassingGrade?: number
}

type EvaluationResult = {
  githubUsername: string
  githubRepositoryName: string
  status: 'passed' | 'failed'
  requiredPercentage: number
  allPercentage: number
  evaluations: {
    description: string
    bonus: boolean
    grade: 'passed' | 'failed'
  }[]
}
