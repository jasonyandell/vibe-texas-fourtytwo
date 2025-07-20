/**
 * Texas 42 Trick Types
 */
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { PlayerPosition } from './player';
/**
 * Played domino in a trick
 * Enhanced with position and play order information
 */
export interface PlayedDomino {
    /** The domino that was played */
    domino: Domino;
    /** Player who played this domino */
    playerId: string;
    /** Position of the player */
    position: PlayerPosition;
    /** Order in which this domino was played (0-3) */
    playOrder: number;
    /** Timestamp when domino was played */
    timestamp: string;
}
/**
 * Complete trick information
 * Enhanced with scoring and winner determination
 */
export interface Trick {
    /** Unique trick identifier */
    id: string;
    /** All dominoes played in this trick */
    dominoes: PlayedDomino[];
    /** Player who won this trick */
    winner?: string;
    /** Suit that was led */
    leadSuit?: DominoSuit;
    /** Total point value of dominoes in this trick */
    pointValue: number;
    /** Count dominoes captured in this trick */
    countDominoes: Domino[];
    /** Trick number in the hand (1-7) */
    trickNumber: number;
    /** True if trick is complete */
    isComplete: boolean;
}
//# sourceMappingURL=trick.d.ts.map