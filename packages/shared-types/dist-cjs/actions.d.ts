/**
 * Texas 42 Game Action Types
 */
import { Domino } from './dominoes';
import { Bid } from './bidding';
import { PlayerPosition } from './player';
import { PartnershipTeam } from './partnership';
import { HandScore } from './scoring';
/**
 * Game actions for state management
 */
export type GameAction = {
    type: 'JOIN_GAME';
    playerId: string;
    playerName: string;
    position: PlayerPosition;
} | {
    type: 'LEAVE_GAME';
    playerId: string;
} | {
    type: 'READY_PLAYER';
    playerId: string;
} | {
    type: 'START_GAME';
} | {
    type: 'PLACE_BID';
    playerId: string;
    bid: Bid;
} | {
    type: 'PLAY_DOMINO';
    playerId: string;
    domino: Domino;
} | {
    type: 'COMPLETE_TRICK';
    trickId: string;
} | {
    type: 'COMPLETE_HAND';
    handScore: HandScore;
} | {
    type: 'START_NEW_HAND';
    dealer: string;
} | {
    type: 'END_GAME';
    winner: PartnershipTeam;
} | {
    type: 'RESET_GAME';
};
//# sourceMappingURL=actions.d.ts.map