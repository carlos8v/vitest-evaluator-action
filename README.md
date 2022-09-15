# Vitest Evaluator Action

## What is it?
Github action to test javascript projects using [vitest](https://github.com/vitest-dev/vitest) library, creating feedback message on PR's.

## Usage

### Classic usage

```yml
on: pull_request

jobs:
  example_test_pr:
    runs-on: ubuntu-latest
    name: An example job to test a PR
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Evaluator Step
        uses: carlos8v/vitest-evaluator-action@v2.2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

### Custom settings

You can customize the action behaviors through custom inputs.

```yml
on: pull_request

jobs:
  example_test_pr:
    runs-on: ubuntu-latest
    name: An example job to test a PR
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Evaluator Step
        uses: carlos8v/vitest-evaluator-action@v2.2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          npm-start: true
          wait-for: 'http://localhost:3000'
          test-coverage: 80
```

# Project Setup

Folder structure should look like this:

```
.
├── .github
| └── workflows
|   └── test.yml
├── .evaluator
| └── requirements.json
└── src
  └── ...
```

**requirements.json**:
```json
{
  "requirements": [
    { "description": "First test", "bonus": false },
    { "description": "Second test", "bonus": false },
    { "description": "Third test", "bonus": true }
  ]
}
```

**test.spec.js**:
```js
describe('First test' () => {
  it('unit test1', () => {})
  it('unit test2', () => {})  
})

describe('Second test' () => {
  it('unit test1', () => {})
})

describe('Third test' () => {
  it('unit test1', () => {})
  it('unit test2', () => {})
})
```

## Inputs

### Action inputs

| Name | Description | Default | Required |
| --- | --- | --- | --- |
| `token` | Token that is used to create comments | - | :heavy_check_mark: |
| `npm-start` | Run npm start and waits to url before testing | false | |
| `wait-for` | Url that npm start command waits for | http://localhost:3000 | |
| `test-coverage` | Minimum porcentage of test coverage to pass successfully | 70 | |
