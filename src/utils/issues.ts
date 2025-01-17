import * as core from '@actions/core'
import * as github from '@actions/github'
import { Endpoints } from '@octokit/types'
import { Reaction } from '../enums.js'

/**
 * Adds a reaction to a specific issue or comment.
 *
 * @param content The type of reaction to add.
 * @return The ID of the reaction.
 */
export async function addReaction(content: Reaction): Promise<number> {
  // Do nothing if there is no issue/comment payload.
  if (github.context.payload.issue === undefined)
    throw new Error('No Issue Payload Found')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  let response: Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/reactions']['response']

  // If there is a comment in the payload, add the reaction to the comment.
  if (github.context.payload.comment !== undefined) {
    core.info(
      `Adding Reaction to Comment: #${github.context.payload.comment.number}`
    )

    response = await octokit.rest.reactions.createForIssueComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue.number,
      comment_id: github.context.payload.comment.id,
      content
    })
  } else {
    core.info(
      `Adding Reaction to Issue: #${github.context.payload.issue.number}`
    )

    response = await octokit.rest.reactions.createForIssue({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue.number,
      content
    })
  }

  // Return the reaction ID.
  return response.data.id
}

/**
 * Removes a reaction from a specific issue or comment.
 *
 * @param id The ID of the reaction to remove.
 */
export async function removeReaction(id: number): Promise<void> {
  // Do nothing if there is no issue/comment payload.
  if (github.context.payload.issue === undefined)
    throw new Error('No Issue Payload Found')

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // If there is a comment in the payload, remove the reaction from the comment.
  if (github.context.payload.comment !== undefined) {
    core.info(
      `Removing Reaction from Comment: #${github.context.payload.comment.id}`
    )

    await octokit.rest.reactions.deleteForIssueComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: github.context.payload.comment.id,
      reaction_id: id
    })
  } else {
    core.info(
      `Removing Reaction from Issue: #${github.context.payload.issue.number}`
    )

    await octokit.rest.reactions.deleteForIssue({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue.number,
      reaction_id: id
    })
  }
}
