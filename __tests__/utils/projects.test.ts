import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/@actions/core.js'
import * as github from '../../__fixtures__/@actions/github.js'
import * as octokit from '../../__fixtures__/@octokit/rest.js'
import { ProjectColumnNames } from '../../src/enums.js'

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
const projects = await import('../../src/utils/projects.js')

// Create a mock instance of the Octokit class
const { Octokit } = await import('@octokit/rest')
const mocktokit = jest.mocked(new Octokit())

describe('moveIssue()', () => {
  beforeEach(() => {
    mocktokit.graphql.mockResolvedValue({
      repository: {
        issue: {
          projectItems: {
            nodes: [
              {
                id: 'PROJECT_ITEM_ID',
                fieldValueByName: {
                  name: 'FIELD_VALUE_NAME',
                  optionId: 'FIELD_VALUE_ID'
                }
              }
            ]
          }
        },
        projectV2: {
          id: 'PROJECT_ID',
          field: {
            id: 'FIELD_ID',
            name: 'FIELD_NAME',
            options: [
              {
                id: 'FIELD_VALUE_ID',
                name: 'FIELD_VALUE_NAME'
              }
            ]
          }
        }
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Moves an issue in a project', async () => {
    await projects.moveIssue(1, 1, 'FIELD_VALUE_NAME' as ProjectColumnNames)

    expect(mocktokit.graphql).toHaveBeenCalledWith(expect.any(String), {
      owner: expect.any(String),
      repo: expect.any(String),
      project: 1,
      issueNumber: 1
    })
    expect(mocktokit.graphql).toHaveBeenCalledWith(expect.any(String), {
      fieldId: expect.any(String),
      itemId: expect.any(String),
      projectId: expect.any(String),
      value: expect.any(String)
    })
  })
})
