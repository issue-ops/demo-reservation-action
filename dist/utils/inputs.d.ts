import { ActionInputs } from '../types.js';
/**
 * Gets all the inputs from the GitHub Actions workflow (except the token).
 *
 * @returns An object containing all the inputs (except the token).
 */
export declare function getInputs(): ActionInputs;
