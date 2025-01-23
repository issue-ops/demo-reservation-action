import * as core from '@actions/core'
import * as github from '@actions/github'
import type { ProjectColumnNames } from '../enums.js'
import type { GraphQlProjectsV2QueryResponse } from '../types.js'

/**
 * Moves an issue to a different column in a project board.
 *
 * @param projectNumber The number of the project to move the issue in.
 * @param issueNumber The number of the issue to move.
 * @param column The name of the column to move the issue to.
 */
export async function moveIssue(
  projectNumber: number,
  issueNumber: number,
  column: ProjectColumnNames
) {
  core.info(`Moving to Project Column: ${column}...`)

  const octokit = github.getOctokit(
    core.getInput('github_token', { required: true })
  )

  // ProjectsV2 uses the GraphQL API. In this case, we need to get the `Status`
  // field, the allowed options, and other metadata in order to change the value
  // for the specific project item that corresponds to the issue.
  const response: GraphQlProjectsV2QueryResponse = await octokit.graphql(
    `
      query ($owner: String!, $repo: String!, $project: Int!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $issueNumber) {
            projectItems(first: 1) {
              nodes {
                id
                fieldValueByName(name: "Status") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    optionId
                  }
                }
              }
            }
          }
          projectV2(number: $project) {
            id
            field(name: "Status") {
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      project: projectNumber,
      issueNumber
    }
  )

  core.info('GraphQL Response:')
  core.info(JSON.stringify(response, null, 2))

  // Update the `Status` field for the issue in the project.
  await octokit.graphql(
    `
      mutation(
        $fieldId: ID!,
        $itemId: ID!,
        $projectId: ID!,
        $value: String!
      ) {
        updateProjectV2ItemFieldValue(input: {
          fieldId: $fieldId,
          itemId: $itemId,
          projectId: $projectId,
          value: { singleSelectOptionId: $value }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `,
    {
      fieldId: response.repository.projectV2.field.id,
      itemId: response.repository.issue.projectItems.nodes[0].id,
      projectId: response.repository.projectV2.id,
      value: response.repository.projectV2.field.options.find(
        (option) => option.name === column
      )!.id
    }
  )
}
