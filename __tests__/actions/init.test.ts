import { jest } from '@jest/globals'
import * as core from '../../__fixtures__/@actions/core.js'
import * as github from '../../__fixtures__/@actions/github.js'
import type { moveIssue } from '../../src/utils/projects.js'

// Mock external modules that are called by the code under test
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)

// Mock internal modules that are called by the code under test
const moveIssueMock = jest.fn<typeof moveIssue>()

jest.unstable_mockModule('../../src/utils/projects.js', () => ({
  moveIssue: moveIssueMock
}))

// Import the code under test
const init = await import('../../src/actions/init.js')

describe('init()', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Moves an issue in a project', async () => {
    await init.init(1)

    expect(moveIssueMock).toHaveBeenCalled()
  })
})
