import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/@actions/core.js'
import * as github from '../../__fixtures__/@actions/github.js'
import * as octokit from '../../__fixtures__/@octokit/rest.js'

// Mock external modules that are called by the code under test
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }
  }

  return {
    Octokit
  }
})

// Mock internal modules that are called by the code under test
jest.unstable_mockModule('../../src/utils/projects.js', () => ({
  moveIssue: jest.fn()
}))

// Import the code under test
const cancel = await import('../../src/actions/cancel.js')

// Create a mock instance of the Octokit class
const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('cancel()', () => {
  beforeEach(() => {
    core.getInput.mockReturnValueOnce('MY_EXAMPLE_TOKEN')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Cancels a request', async () => {
    await cancel.cancel(1)

    expect(mocktokit.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 1,
      labels: ['cancelled']
    })
    expect(mocktokit.rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 1,
      body: expect.any(String)
    })
    expect(mocktokit.rest.issues.update).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 1,
      state: 'closed',
      state_reason: 'not_planned'
    })
  })
})
