import * as core from '@actions/core'
import * as github from '@actions/github'
import { dedent } from 'ts-dedent'
import { ProjectColumnNames } from '../enums.js'
import { moveIssue } from '../utils/projects.js'

/**
 * Cancels the reservation request by performing the following steps:
 *
 * - Add the `cancelled` label to the issue.
 * - Move the issue to the Cancelled Reservations project column.
 * - Add a comment to the issue with the results.
 * - If not closed already, closes the issue.
 *
 * @param projectNumber The number of the project to move the issue in.
 * @returns An error message if the request is invalid, undefined otherwise.
 */
export async function cancel(projectNumber: number): Promise<void> {
  core.startGroup('Processing Cancellation Request...')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // Add the `confirmed` label to the issue.
  await octokit.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue!.number,
    labels: ['cancelled']
  })

  // Move the issue to the Confirmed Reservations project column.
  await moveIssue(
    projectNumber,
    github.context.payload.issue!.number,
    ProjectColumnNames.CANCELLED
  )

  // Add a comment to the issue with the results.
  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue!.number,
    body: dedent`### :calendar: Reservation Request Cancelled

    Your reservation request has been cancelled! We are sorry that you have chosen to cancel your stay at Bear Creek Honey Farm.

    However, it is probably for the best. This is a completely fictional location and we don't have any rooms to offer you.

    Thank you for trying our IssueOps demonstration!`
  })

  // Close the issue.
  await octokit.rest.issues.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue!.number,
    state: 'closed',
    state_reason: 'not_planned'
  })

  core.endGroup()
}
