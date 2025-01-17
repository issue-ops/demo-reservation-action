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
export declare function expire(projectNumber: number, issueTemplateBody: string): Promise<void>;
