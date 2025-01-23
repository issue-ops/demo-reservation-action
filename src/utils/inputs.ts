import * as core from '@actions/core'
import type { ParsedBody } from '@github/issue-parser'
import type { ActionInputs } from '../types.js'

/**
 * Gets all the inputs from the GitHub Actions workflow (except the token).
 *
 * @returns An object containing all the inputs (except the token).
 */
export function getInputs(): ActionInputs {
  // The action to take (`init`, `reserve`, `cancel`, or 'expire').
  const action: string = core.getInput('action', { required: true })

  // The issue body as a JSON string. This is typically the output of the
  // `issue-ops/parser` action. When the expiration action is run, the issue
  // body will be missing.
  const issueBody: ParsedBody =
    core.getInput('issue_body') !== ''
      ? JSON.parse(core.getInput('issue_body'))
      : {}

  // Path to the issue template file from the root of the repository.
  const issueTemplatePath: string = core.getInput('issue_template_path', {
    required: true
  })

  // The number of the project board where reservations are managed.
  const projectNumber: number = Number(
    core.getInput('project_number', { required: true })
  )

  // The path where the repository has been cloned using the `actions/checkout`
  // step.
  const workspace: string = core.getInput('workspace', { required: true })

  core.startGroup('Running Action...')
  core.info(`  action: ${action}`)
  core.info(`  issueBody: ${JSON.stringify(issueBody)}`)
  core.info(`  issueTemplatePath: ${issueTemplatePath}`)
  core.info(`  projectNumber: ${projectNumber}`)
  core.info(`  workspace: ${workspace}`)
  core.endGroup()

  return {
    action,
    issueBody,
    issueTemplatePath,
    projectNumber,
    workspace
  }
}
