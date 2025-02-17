/**
 * Test Fixture for @actions/github
 */
import type { Context } from '@actions/github/lib/context.js'
import * as octokit from '../@octokit/rest.js'

export const getOctokit = () => octokit

export const context = {
  eventName: 'issues',
  repo: {
    owner: 'issue-ops',
    repo: 'bear-creek-honey-farm'
  },
  issue: {
    number: 1
  },
  payload: {
    action: 'opened',
    issue: {
      number: 1
    }
    // comment: {
    //   id: 1
    // }
  }
} as Context
