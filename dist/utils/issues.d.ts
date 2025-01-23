import type { Reaction } from '../enums.js';
/**
 * Adds a reaction to a specific issue or comment.
 *
 * @param content The type of reaction to add.
 * @return The ID of the reaction.
 */
export declare function addReaction(content: Reaction): Promise<number>;
/**
 * Removes a reaction from a specific issue or comment.
 *
 * @param id The ID of the reaction to remove.
 */
export declare function removeReaction(id: number): Promise<void>;
