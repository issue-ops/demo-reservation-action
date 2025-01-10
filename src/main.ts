import * as core from '@actions/core'

/**
 * The entrypoint for the action
 */
export async function run(): Promise<void> {
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
  core.info(`  issueBody: ${issueBody}`)
  core.info(`  owner: ${owner}`)
  core.info(`  repository: ${repository}`)
  core.info(`  workspace: ${workspace}`)
}
