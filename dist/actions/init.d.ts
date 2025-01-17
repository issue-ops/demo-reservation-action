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
export declare function init(projectNumber: number): Promise<void>;
