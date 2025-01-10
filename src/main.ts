import * as core from '@actions/core'
import * as github from '@actions/github'
import { AllowedActions } from './enums.js'

/**
 * The entrypoint for the action
 */
export async function run(): Promise<void> {
  // Fail if the action is being run on an unsupported event type.
  if (
    !['issues', 'issue_comment', 'schedule'].includes(github.context.eventName)
  )
    throw new Error(
      'This action can only be run on issues, issue_comments, and schedule events.'
    )

  // Get the inputs
  const action: string = core.getInput('action', { required: true })
  const issueBody: object = JSON.parse(
    core.getInput('issue_body', { required: true })
  )
  // const githubToken: string = core.getInput('github_token', { required: true })
  const [owner, repository] = core
    .getInput('repository', { required: true })
    .split('/')
  const workspace: string = core.getInput('workspace', { required: true })

  core.info('Running action with the following inputs:')
  core.info(`  action: ${action}`)
  core.info(`  issueBody: ${JSON.stringify(issueBody, null, 2)}`)
  core.info(`  owner: ${owner}`)
  core.info(`  repository: ${repository}`)
  core.info(`  workspace: ${workspace}`)

  // Fail if the specified action isn't valid.
  if (!Object.values(AllowedActions).includes(action as AllowedActions))
    throw new Error(`Invalid action: ${action}`)
}
