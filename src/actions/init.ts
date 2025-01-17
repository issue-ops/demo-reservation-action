import * as core from '@actions/core'
import * as github from '@actions/github'
import { ProjectColumnNames } from '../enums.js'
import { moveIssue } from '../utils/projects.js'

/**
 * Initializes the reservation request by performing the following steps:
 *
 * - Move the issue to the New Reservations project column.
 *
 * @param reservation The reservation request details.
 * @param issueTemplateBody The body of the issue template.
 * @param projectNumber The number of the project to move the issue in.
 * @returns An error message if the request is invalid, undefined otherwise.
 */
export async function init(projectNumber: number): Promise<void> {
  core.startGroup('Processing Reservation Initialization...')

  // Move the issue to the New Reservations project column.
  await moveIssue(
    projectNumber,
    github.context.payload.issue!.number,
    ProjectColumnNames.NEW
  )

  core.endGroup()
}
