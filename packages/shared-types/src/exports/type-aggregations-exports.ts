/**
 * Type Aggregations Export Module
 * Provides convenient grouped type exports
 */

import type { Domino } from '../dominoes';
import type { DominoSuit } from '../trump';
import type { Player } from '../player';
import type { GameState } from '../game-state';
import type { Trick } from '../trick';
import type { Bid } from '../bidding';
import type { ValidationResult, ValidationError, ValidationContext } from '../validation';
import type { Partnership, PartnershipState, PartnershipMarks, PartnershipTeam } from '../partnership';

/**
 * Core game types that are frequently used together
 */
export type CoreGameTypes = {
  Domino: Domino;
  DominoSuit: DominoSuit;
  Player: Player;
  GameState: GameState;
  Bid: Bid;
  Trick: Trick;
};

/**
 * Validation types that are frequently used together
 */
export type ValidationTypes = {
  ValidationResult: ValidationResult;
  ValidationError: ValidationError;
  ValidationContext: ValidationContext;
};

/**
 * Partnership types that are frequently used together
 */
export type PartnershipTypes = {
  Partnership: Partnership;
  PartnershipState: PartnershipState;
  PartnershipMarks: PartnershipMarks;
  PartnershipTeam: PartnershipTeam;
};