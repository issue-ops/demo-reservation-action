import * as core from '@actions/core'
import * as github from '@actions/github'
import { ProjectColumnNames } from '../enums.js'

/**
 * Moves an issue to a different column in a project board.
 *
 * @param projectId The ID of the project to move the issue in.
 * @param column The name of the column to move the issue to.
 */
export async function moveIssue(projectId: number, column: ProjectColumnNames) {
  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // Since we don't have the column IDs, we can fetch them from the project
  // and use the column name to find the correct column ID.
  const targetColumn = (
    await octokit.rest.projects.listColumns({
      project_id: projectId
    })
  ).data.find((col) => col.name === column)

  if (!targetColumn) throw new Error(`Project Column Not Found: ${column}`)

  await octokit.rest.projects.moveCard({
    card_id: github.context.payload.issue!.node_id,
    position: 'top',
    column_id: targetColumn.id
  })
}
