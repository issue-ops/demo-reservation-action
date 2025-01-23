import { jest } from '@jest/globals'
import { Endpoints } from '@octokit/types'
import * as core from '../../__fixtures__/@actions/core.js'
import * as github from '../../__fixtures__/@actions/github.js'
import * as octokit from '../../__fixtures__/@octokit/rest.js'
import { Reaction } from '../../src/enums.js'

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

// Import the code under test
const issues = await import('../../src/utils/issues.js')

// Create a mock instance of the Octokit class
const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('Issues', () => {
  beforeEach(() => {
    core.getInput.mockReturnValueOnce('MY_EXAMPLE_TOKEN')

    github.context.payload = {
      action: 'opened',
      issue: {
        number: 1
      }
      // comment: {
      //   id: 1
      // }
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('addReaction()', () => {
    beforeEach(() => {
      mocktokit.rest.reactions.createForIssue.mockResolvedValue({
        data: {
          id: 1
        }
      } as Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/reactions']['response'])

      mocktokit.rest.reactions.createForIssueComment.mockResolvedValue({
        data: {
          id: 1
        }
      } as Endpoints['POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions']['response'])
    })

    it('Throws if there is no issue payload', async () => {
      github.context.payload = {}

      await expect(issues.addReaction(Reaction.EYES)).rejects.toThrow()
    })

    it('Adds a reaction to an issue', async () => {
      await issues.addReaction(Reaction.EYES)

      expect(mocktokit.rest.reactions.createForIssue).toHaveBeenCalledWith({
        owner: 'issue-ops',
        repo: 'bear-creek-honey-farm',
        issue_number: 1,
        content: Reaction.EYES
      })
    })

    it('Adds a reaction to an issue comment', async () => {
      github.context.payload = {
        action: 'opened',
        issue: {
          number: 1
        },
        comment: {
          id: 1
        }
      }

      await issues.addReaction(Reaction.EYES)

      expect(
        mocktokit.rest.reactions.createForIssueComment
      ).toHaveBeenCalledWith({
        owner: 'issue-ops',
        repo: 'bear-creek-honey-farm',
        issue_number: 1,
        comment_id: 1,
        content: Reaction.EYES
      })
    })
  })

  describe('removeReaction', () => {
    it('Throws if there is no issue payload', async () => {
      github.context.payload = {}

      await expect(issues.removeReaction(1)).rejects.toThrow()
    })

    it('Removes a reaction from an issue', async () => {
      github.context.payload = {
        issue: {
          number: 1
        }
      }

      await issues.removeReaction(1)

      expect(mocktokit.rest.reactions.deleteForIssue).toHaveBeenCalled()
    })

    it('Removes a reaction from an issue comment', async () => {
      github.context.payload = {
        issue: {
          number: 1
        },
        comment: {
          id: 1
        }
      }

      await issues.removeReaction(1)

      expect(mocktokit.rest.reactions.deleteForIssueComment).toHaveBeenCalled()
    })
  })
})
