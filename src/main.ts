import * as core from '@actions/core'
import * as github from '@actions/github'
import { readFileSync } from 'fs'
import path from 'path'
import { reserve } from './actions/reserve.js'
import {
  AllowedActions,
  AllowedTriggers,
  Reaction,
  RoomAmenity,
  RoomType
} from './enums.js'
import { ReservationRequest } from './types.js'
import { getInputs } from './utils/inputs.js'
import { addReaction, removeReaction } from './utils/issues.js'

/**
 * The entrypoint for the action.
 */
export async function run(): Promise<void> {
  // Fail if the action is being run on an unsupported event type.
  const eventName = github.context.eventName as AllowedTriggers
  if (!Object.values(AllowedTriggers).includes(eventName))
    return core.setFailed(`Invalid Workflow Trigger: ${eventName}`)

  // Get the action inputs.
  const { action, issueBody, issueTemplatePath, projectId, workspace } =
    getInputs()

  // Fail if the specified action isn't valid.
  if (!Object.values(AllowedActions).includes(action as AllowedActions))
    return core.setFailed(`Invalid Action: ${action}`)

  // The expire action functions differently than the others. Since it runs on
  // a schedule event, it doesn't have access to a specific issue body. As such,
  // it should be processed separately from the actions that are triggered by
  // specific issue/comment events.
  if ((action as AllowedActions) === AllowedActions.EXPIRE) {
    // return await expire()
    return core.setFailed('Expire action not implemented yet')
  }

  // Add a reaction to the issue to indicate that the action is processing.
  const initialReactionId: number = await addReaction(Reaction.EYES)

  // Since the issue body was already parsed using the `issue-ops/parser`
  // action, we can access the parsed data from the `issueBody` property.
  core.startGroup('Parsed Issue Body:')
  core.info(JSON.stringify(issueBody, null, 2))
  core.endGroup()

  // Get the issue template body from the `issueTemplatePath` input.
  const issueTemplateBody = readFileSync(
    path.join(workspace, '.github', 'ISSUE_TEMPLATE', issueTemplatePath),
    'utf8'
  )
  core.startGroup('Issue Template Body:')
  core.info(issueTemplateBody)
  core.endGroup()

  // (Optional) Convert the parsed issue body to a more strongly-typed object.
  // This prevents needing to constantly cast the properties to the correct
  // types during invocation of your action.
  const reservation: ReservationRequest = {
    checkIn: new Date(issueBody['check-in'] as string),
    checkOut: new Date(issueBody['check-out'] as string),
    guests: Number(issueBody.guests as string),
    room: (issueBody.room as string[])[0] as RoomType,
    amenities: issueBody.amenities as {
      selected: RoomAmenity[]
      unselected: RoomAmenity[]
    }
  }

  core.startGroup('Parsed Reservation Request:')
  core.info(JSON.stringify(reservation, null, 2))
  core.endGroup()

  // Depending on the action, run the appropriate function.
  switch (action) {
    case AllowedActions.RESERVE:
      // Initialize the request.
      await reserve(reservation, issueTemplateBody, projectId)

      // Remove the initial reaction and add a thumbs up to indicate success.
      await removeReaction(initialReactionId)
      await addReaction(Reaction.THUMBS_UP)
      break
    case AllowedActions.CANCEL:
      // return await submit()
      core.info('Cancel action not implemented yet')

      // Remove the initial reaction and add a thumbs up to indicate success.
      await removeReaction(initialReactionId)
      await addReaction(Reaction.THUMBS_UP)
      break
    default:
      // Remove the initial reaction and add a thumbs down to indicate failure.
      await removeReaction(initialReactionId)
      await addReaction(Reaction.THUMBS_DOWN)
      throw new Error(`Invalid Action: ${action}`)
  }
}
