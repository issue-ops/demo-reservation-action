import { ProjectColumnNames } from '../enums.js';
/**
 * Moves an issue to a different column in a project board.
 *
 * @param projectNumber The number of the project to move the issue in.
 * @param issueNumber The number of the issue to move.
 * @param column The name of the column to move the issue to.
 */
export declare function moveIssue(projectNumber: number, issueNumber: number, column: ProjectColumnNames): Promise<void>;
