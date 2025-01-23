import type { parseIssue } from '@github/issue-parser'
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/@actions/core.js'
import * as github from '../__fixtures__/@actions/github.js'
import * as fs from '../__fixtures__/fs.js'
import type { cancel } from '../src/actions/cancel.js'
import type { expire } from '../src/actions/expire.js'
import type { init } from '../src/actions/init.js'
import type { reserve } from '../src/actions/reserve.mjs'
import { getInputs } from '../src/utils/inputs.js'
import type { addReaction } from '../src/utils/issues.js'

const getInputsMock = jest.fn<typeof getInputs>()
const addReactionMock = jest.fn<typeof addReaction>()
const removeReactionMock = jest.fn<typeof addReaction>()
const parseIssueMock = jest.fn<typeof parseIssue>()
const reserveMock = jest.fn<typeof reserve>()
const expireMock = jest.fn<typeof expire>()
const initMock = jest.fn<typeof init>()
const cancelMock = jest.fn<typeof cancel>()

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
jest.unstable_mockModule('../src/actions/reserve.mjs', () => ({
  reserve: reserveMock
}))
jest.unstable_mockModule('../src/actions/expire.js', () => ({
  expire: expireMock
}))
jest.unstable_mockModule('../src/actions/init.js', () => ({
  init: initMock
}))
jest.unstable_mockModule('../src/actions/cancel.js', () => ({
  cancel: cancelMock
}))

const main = await import('../src/main.js')

const inputFactory = () => ({
  action: 'reserve',
  issueBody: {
    'check-in': '01/18/2025',
    'check-out': '01/18/2025',
    guests: '2',
    room: ['King Suite'],
    amenities: {
      selected: ['Lunch', 'Dinner'],
      unselected: ['Breakfast', 'Wi-Fi', 'Hot Tub']
    }
  },
  issueTemplatePath: 'reservation.yml',
  projectNumber: 1,
  workspace: '/path/to/workspace'
})

describe('main', () => {
  beforeEach(() => {
    getInputsMock.mockReturnValue(inputFactory())

    fs.readFileSync.mockReturnValue('Issue Template Body')
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

  it('Fails if the action input is invalid', async () => {
    const input = inputFactory()
    input.action = 'invalid'
    getInputsMock.mockReturnValue(input)

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith('Invalid Action: invalid')
  })

  it('Expires issues', async () => {
    const input = inputFactory()
    input.action = 'expire'
    getInputsMock.mockReturnValue(input)

    await main.run()

    expect(expireMock).toHaveBeenCalled()
    expect(initMock).not.toHaveBeenCalled()
    expect(reserveMock).not.toHaveBeenCalled()
    expect(cancelMock).not.toHaveBeenCalled()
  })

  it('Processes a reservation', async () => {
    getInputsMock.mockReturnValue(inputFactory())

    await main.run()

    expect(expireMock).not.toHaveBeenCalled()
    expect(initMock).not.toHaveBeenCalled()
    expect(reserveMock).toHaveBeenCalled()
    expect(cancelMock).not.toHaveBeenCalled()
  })

  it('Processes an initialization', async () => {
    const input = inputFactory()
    input.action = 'init'
    getInputsMock.mockReturnValue(input)

    await main.run()

    expect(expireMock).not.toHaveBeenCalled()
    expect(initMock).toHaveBeenCalled()
    expect(reserveMock).not.toHaveBeenCalled()
    expect(cancelMock).not.toHaveBeenCalled()
  })

  it('Processes a cancellation', async () => {
    const input = inputFactory()
    input.action = 'cancel'
    getInputsMock.mockReturnValue(input)

    await main.run()

    expect(expireMock).not.toHaveBeenCalled()
    expect(initMock).not.toHaveBeenCalled()
    expect(reserveMock).not.toHaveBeenCalled()
    expect(cancelMock).toHaveBeenCalled()
  })
})
