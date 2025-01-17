import type { parseIssue } from '@github/issue-parser'
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'
import * as github from '../__fixtures__/@actions/github.js'
import * as fs from '../__fixtures__/fs.js'
import type { reserve } from '../src/actions/reserve.js'
import { getInputs } from '../src/utils/inputs.js'
import type { addReaction } from '../src/utils/issues.js'

const getInputsMock = jest.fn<typeof getInputs>()
const addReactionMock = jest.fn<typeof addReaction>()
const removeReactionMock = jest.fn<typeof addReaction>()
const parseIssueMock = jest.fn<typeof parseIssue>()
const reserveMock = jest.fn<typeof reserve>()

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@github/issue-parser', () => ({
  parseIssue: parseIssueMock
}))
jest.unstable_mockModule('fs', () => fs)
jest.unstable_mockModule('../src/utils/inputs.js', () => ({
  getInputs: getInputsMock
}))
jest.unstable_mockModule('../src/utils/issues.js', () => ({
  addReaction: addReactionMock,
  removeReaction: removeReactionMock
}))
jest.unstable_mockModule('../src/actions/reserve.js', () => ({
  reserve: reserveMock
}))

const main = await import('../src/main.js')

describe('main', () => {
  beforeEach(() => {
    getInputsMock.mockReturnValue({
      action: 'reserve',
      issueBody: 'test',
      issueTemplatePath: 'reservation.yml',
      projectId: 1,
      workspace: '/path/to/workspace'
    })
  })

  afterEach(() => {
    jest.resetAllMocks()

    // Reset various test data.
    github.context.eventName = 'issues'
  })

  it('Fails if the workflow trigger is invalid', async () => {
    github.context.eventName = 'invalid'

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Invalid Workflow Trigger: invalid'
    )
  })
})
