import * as core from '@actions/core'
import { ProjectColumnNames } from '../enums.js'
import { ReservationRequest } from '../types.js'
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
export async function init(
  reservation: ReservationRequest,
  issueTemplateBody: string,
  projectNumber: number
): Promise<void> {
  core.startGroup('Processing Reservation Initialization...')

  // Move the issue to the New Reservations project column.
  await moveIssue(projectNumber, ProjectColumnNames.NEW)

  core.endGroup()
}
