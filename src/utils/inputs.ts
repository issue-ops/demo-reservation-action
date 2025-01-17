import * as core from '@actions/core'
import type { ParsedBody } from '@github/issue-parser'
import { ActionInputs } from '../types.js'

/**
 * Gets all the inputs from the GitHub Actions workflow (except the token).
 *
 * @returns An object containing all the inputs (except the token).
 */
export function getInputs(): ActionInputs {
  // Get the action inputs.
  const action: string = core.getInput('action', { required: true })
  const issueBody: ParsedBody = JSON.parse(
    core.getInput('issue_body', { required: true })
  )
  const issueTemplatePath: string = core.getInput('issue_template_path')
  const projectNumber: number = Number(
    core.getInput('project_number', { required: true })
  )
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
