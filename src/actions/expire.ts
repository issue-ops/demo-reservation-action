import * as core from '@actions/core'
import * as github from '@actions/github'
import { parseIssue } from '@github/issue-parser'
import { dedent } from 'ts-dedent'
import { ProjectColumnNames } from '../enums.js'
import { moveIssue } from '../utils/projects.js'

/**
 * Expires reservation requests by performing the following steps:
 *
 * - Add the `expired` label to the issue.
 * - Move the issue to the Expired Reservations project column.
 * - Add a comment to the issue with the results.
 * - If not closed already, closes the issue.
 *
 * @param projectNumber The number of the project to move the issue in.
 * @param issueTemplateBody The body of the issue template.
 * @returns An error message if the request is invalid, undefined otherwise.
 */
export async function expire(
  projectNumber: number,
  issueTemplateBody: string
): Promise<void> {
  core.startGroup('Processing Expiration Request...')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // Get the list of existing reservations from the GitHub Issues API.
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    state: 'open', // Open issues only; closed are considered past reservations.
    labels: 'reservation' // Only issues with the `reservation` label.
  })

  core.info(`Existing Reservations: ${issues.length}`)

  // Check the end date for each reservation. If it has passed, expire the
  // reservation.
  for (const issue of issues) {
    // Get the reservation information from the issue body.
    // Parse the issue body to get the existing reservation details.
    const reservation = parseIssue(issue.body as string, issueTemplateBody)

    // Check if the end date has passed.
    if (new Date(reservation['check-out'] as string) < new Date()) {
      core.info(`Reservation Expired: ${issue.number}`)

      // Add the `expired` label to the issue.
      await octokit.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issue.number,
        labels: ['expired']
      })

      // Move the issue to the Confirmed Reservations project column.
      await moveIssue(projectNumber, issue.number, ProjectColumnNames.EXPIRED)

      // Add a comment to the issue with the results.
      await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issue.number,
        body: dedent`### :calendar: Reservation Request Expired!

        We hope you enjoyed your fake stay! Please pretend to come back soon!

        Thank you for trying our IssueOps demonstration!`
      })

      // Close the issue.
      await octokit.rest.issues.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issue.number,
        state: 'closed',
        state_reason: 'completed'
      })
    }
  }

  core.endGroup()
}
