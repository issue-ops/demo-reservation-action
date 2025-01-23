import type { ReservationRequest } from '../types.js';
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
export declare function reserve(reservation: ReservationRequest, issueTemplateBody: string, projectNumber: number): Promise<void>;
