import * as core from '@actions/core'
import * as github from '@actions/github'
import { parseIssue } from '@github/issue-parser'
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods'
import { readFileSync } from 'fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { dedent } from 'ts-dedent'
import { ProjectColumnNames } from '../enums.js'
import { ReservationRequest, Room } from '../types.js'
import { moveIssue } from '../utils/projects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Confirms the reservation request by performing the following steps:
 *
 * - Double check that there is a room available for the selected dates.
 * - Add the `confirmed` label to the issue.
 * - Move the issue to the Confirmed Reservations project column.
 * - Add a comment to the issue with the results.
 *
 * @param reservation The reservation request details.
 * @param issueTemplateBody The body of the issue template.
 * @param projectNumber The number of the project to move the issue in.
 * @returns An error message if the request is invalid, undefined otherwise.
 */
export async function reserve(
  reservation: ReservationRequest,
  issueTemplateBody: string,
  projectNumber: number
): Promise<void> {
  core.startGroup('Processing Reservation Request...')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  core.info('Getting Rooms')

  // Get the list of rooms from the JSON file.
  const rooms = JSON.parse(
    readFileSync(path.join(__dirname, '..', 'rooms.json'), 'utf8')
  ) as Room[]

  core.info('Rooms JSON File:')
  core.info(JSON.stringify(rooms, null, 2))

  // Get the rooms that match the room type from the JSON file.
  const matching = rooms.filter((room) => room.type === reservation.room)

  core.info('Matching Rooms:')
  core.info(JSON.stringify(matching, null, 2))

  // Get the conflicting reservations (any confirmed reservations with the same
  // room type and overlapping date ranges).
  const conflicting = await getConflictingReservations(
    reservation,
    issueTemplateBody,
    github.context.repo.owner,
    github.context.repo.repo
  )

  // If there are more conflicting reservations than available rooms, reject the
  // request. This can happen at this stage because another request may have
  // been submitted between the time the issue was opened and now.
  if (conflicting.length >= matching.length) {
    core.info('No Rooms Available!')

    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue!.number,
      body: dedent`### :calendar: Reservation Request Failed

      All available rooms of this type have been booked for the selected dates. Please modify your request and try again!`
    })

    // Stop here! Do not add any labels or move the issue in the project.
    core.endGroup()
    return
  }

  // Add the `confirmed` label to the issue.
  await octokit.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue!.number,
    labels: ['confirmed']
  })

  // Move the issue to the Confirmed Reservations project column.
  await moveIssue(projectNumber, ProjectColumnNames.CONFIRMED)

  // Add a comment to the issue with the results.
  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.issue!.number,
    body: dedent`### :calendar: Reservation Request Confirmed

    Hooray! Your reservation request has been confirmed! The total cost of your stay is **${matching[0].price}**. You can submit payment after conclusion of your stay, which will never happen, because this is a demo project.

    If you would like to cancel your reservation, you can do either of the following:

    - Comment on the issue with \`/cancel\`
    - Close the issue

    Please note, if you cancel your reservation, you will not be refunded the cost of your stay. This is because you didn't pay anything to begin with.`
  })

  core.endGroup()
}

/**
 * Gets confirmed reservations that conflict with the selected date range. Any
 * confirmed reservations with the same room type and overlapping dates are
 * considered a conflict.
 *
 * This is done by checking the list of existing reservations and seeing if the
 * number of reservations for this date rate equals or exceeds the number of
 * available rooms. In a real-world scenario, this would be done by querying a
 * database or API that contains the list of existing rooms and reservations. In
 * this example, we're comparing a list of rooms (JSON file) with a list of
 * confirmed reservations (GitHub Issues).
 *
 * @param reservation The reservation request details.
 * @param issueTemplateBody The body of the issue template.
 * @param owner The owner of the repository that triggered the action.
 * @param repository The name of the repository that triggered the action.
 * @returns A boolean indicating whether or not there is an available room for
 *          the selected dates.
 */
async function getConflictingReservations(
  reservation: ReservationRequest,
  issueTemplateBody: string,
  owner: string,
  repository: string
): Promise<
  RestEndpointMethodTypes['issues']['listForRepo']['response']['data']
> {
  core.info('Checking Room Availability...')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // Get the list of existing reservations from the GitHub Issues API.
  const issues: RestEndpointMethodTypes['issues']['listForRepo']['response']['data'] =
    await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner,
      repo: repository,
      state: 'open', // Open issues only; closed are considered past reservations.
      labels: 'confirmed,reservation' // Confirmed reservations only.
    })

  core.info(`Existing Reservations: ${issues.length}`)

  // Get a count of confirmed reservations that conflict with the selected
  // dates. A confirmed reservation conflicts if the start date or end date
  // falls within the range of the selected dates for the new reservation.
  const result = issues.filter((issue) => {
    // Parse the issue body to get the existing reservation details.
    const existingReservation = parseIssue(
      issue.body as string,
      issueTemplateBody
    )

    // Ignore reservations where the room type does not match.
    if (existingReservation.room !== reservation.room) return false

    return (
      // New reservation's check-out date is between the existing reservation's
      // check-in and check-out dates.
      (reservation.checkOut >=
        new Date(existingReservation['check-in'] as string) &&
        reservation.checkOut <=
          new Date(existingReservation['check-out'] as string)) ||
      // New reservation's check-in date is between the existing reservation's
      // check-in and check-out dates.
      (reservation.checkIn >=
        new Date(existingReservation['check-in'] as string) &&
        reservation.checkIn <=
          new Date(existingReservation['check-out'] as string)) ||
      // New reservation starts before and ends after existing reservation.
      (reservation.checkIn <=
        new Date(existingReservation['check-in'] as string) &&
        reservation.checkOut >=
          new Date(existingReservation['check-out'] as string))
    )
  })

  core.info(`Conflicting Reservations: ${result.length}`)

  return result
}
