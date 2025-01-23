import type { parseIssue } from '@github/issue-parser'
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
const parseIssuMock = jest.fn<typeof parseIssue>()

jest.unstable_mockModule('@github/issue-parser', () => ({
  parseIssue: parseIssuMock
}))

jest.unstable_mockModule('../../src/utils/projects.js', () => ({
  moveIssue: jest.fn()
}))

// Import the code under test
const expire = await import('../../src/actions/expire.js')

// Create a mock instance of the Octokit class
const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('expire()', () => {
  beforeEach(() => {
    core.getInput.mockReturnValueOnce('MY_EXAMPLE_TOKEN')

    mocktokit.paginate.mockResolvedValue([
      {
        number: 1,
        body: 'Reservation'
      },
      {
        number: 2,
        body: 'Reservation'
      }
    ])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Expires requests', async () => {
    parseIssuMock.mockReturnValue({
      'check-out': '2023-01-01T00:00:00Z'
    })

    await expire.expire(1, 'Template Body')

    expect(mocktokit.paginate).toHaveBeenCalled()

    // First issue is expired
    expect(mocktokit.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 1,
      labels: ['expired']
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
      state_reason: 'completed'
    })

    // Second issue is expired
    expect(mocktokit.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 2,
      labels: ['expired']
    })
    expect(mocktokit.rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 2,
      body: expect.any(String)
    })
    expect(mocktokit.rest.issues.update).toHaveBeenCalledWith({
      owner: 'issue-ops',
      repo: 'bear-creek-honey-farm',
      issue_number: 2,
      state: 'closed',
      state_reason: 'completed'
    })
  })
})
