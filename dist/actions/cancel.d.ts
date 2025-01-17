/**
 * Cancels the reservation request by performing the following steps:
 *
 * - Add the `cancelled` label to the issue.
 * - Move the issue to the Cancelled Reservations project column.
 * - Add a comment to the issue with the results.
 * - If not closed already, closes the issue.
 *
 * @param projectNumber The number of the project to move the issue in.
 * @returns An error message if the request is invalid, undefined otherwise.
 */
export declare function cancel(projectNumber: number): Promise<void>;
