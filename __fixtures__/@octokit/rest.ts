import { jest } from '@jest/globals'
import { Endpoints } from '@octokit/types'

export const graphql = jest.fn()
export const paginate = jest.fn()
export const rest = {
  issues: {
    addLabels:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/labels']['response']
        >
      >(),
    createComment:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']
        >
      >(),
    listComments:
      jest.fn<
        () => Promise<
          Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']
        >
      >(),
    listForRepo:
      jest.fn<
        () => Promise<Endpoints['GET /repos/{owner}/{repo}/issues']['response']>
      >(),
    removeLabel:
      jest.fn<
        () => Promise<
          Endpoints['DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}']['response']
        >
      >(),
    update:
      jest.fn<
        () => Promise<
          Endpoints['PATCH /repos/{owner}/{repo}/issues/{issue_number}']['response']
        >
      >()
  },
  reactions: {
    createForIssue:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/reactions']['response']
        >
      >(),
    createForIssueComment:
      jest.fn<
        () => Promise<
          Endpoints['POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions']['response']
        >
      >(),
    deleteForIssue:
      jest.fn<
        () => Promise<
          Endpoints['DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}']['response']
        >
      >(),
    deleteForIssueComment:
      jest.fn<
        () => Promise<
          Endpoints['DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}']['response']
        >
      >()
  },
  projects: {
    listColumns:
      jest.fn<
        () => Promise<
          Endpoints['GET /projects/{project_id}/columns']['response']
        >
      >(),
    moveCard:
      jest.fn<
        () => Promise<
          Endpoints['POST /projects/columns/cards/{card_id}/moves']['response']
        >
      >()
  }
}
