import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/@actions/core.js'

// Mock external modules that are called by the code under test
jest.unstable_mockModule('@actions/core', () => core)

// Import the code under test
const inputs = await import('../../src/utils/inputs.js')

describe('getInputs()', () => {
  beforeEach(() => {
    core.getInput
      .mockReturnValueOnce('init') // action
      .mockReturnValueOnce(
        JSON.stringify({
          title: 'Issue Title',
          body: 'Issue Body'
        })
      ) // issue_body
      .mockReturnValueOnce(
        JSON.stringify({
          title: 'Issue Title',
          body: 'Issue Body'
        })
      ) // issue_body
      .mockReturnValueOnce('issue-template.md') // issue_template_path
      .mockReturnValueOnce('1') // project_number
      .mockReturnValueOnce('/path/to/workspace') // workspace
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Gets the inputs', () => {
    inputs.getInputs()

    expect(core.getInput).toHaveBeenCalledTimes(6)
  })

  it('Sets an empty issue body', () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('init') // action
      .mockReturnValueOnce('') // issue_body
      .mockReturnValueOnce('issue-template.md') // issue_template_path
      .mockReturnValueOnce('1') // project_number
      .mockReturnValueOnce('/path/to/workspace') // workspace

    inputs.getInputs()

    expect(core.getInput).toHaveBeenCalledTimes(5)
  })
})
