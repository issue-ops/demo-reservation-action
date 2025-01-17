import { ProjectColumnNames } from '../enums.js';
/**
 * Moves an issue to a different column in a project board.
 *
 * @param projectId The ID of the project to move the issue in.
 * @param column The name of the column to move the issue to.
 */
export declare function moveIssue(projectId: number, column: ProjectColumnNames): Promise<void>;
