import BigNumber from 'bignumber.js';
export interface IClaim {
    /**
     * Dispute id
     */
    id: number;
    /**
     * Id of the deal which dispute was opened for
     */
    dealId: number;
    /**
     * Dispute's requester id
     */
    requesterId: string;
    /**
     * Dispute's respondent id
     */
    respondentId: string;
    /**
     * Dispute requester's wallet address
     */
    requesterAddress: string;
    /**
     * Dispute respondent's wallet address
     */
    respondentAddress: string;
    /**
     * Requester's description of the problem the dispute was opened for
     */
    reasonNote: string;
    /**
     * Respondent's provided resolution note to the problem
     */
    resolutionNote: string;
    /**
     * Amount of staked MTH tokens
     */
    requesterStaked: BigNumber;
    /**
     * Dispute's state
     */
    stateId: ClaimStatus;
    /**
     * Date when dispute was last modified
     */
    modifiedAt: string;
    /**
     * Claim handler's contract address that dispute is stored in
     */
    contractAddress: string;
}
export declare enum ClaimStatus {
    Null = 0,
    /**
     * Dispute was opened by requester and awaits respondent's acceptance
     */
    AwaitingAcceptance = 1,
    /**
     * Dispute was accepted by respondent and awaits for respondent's resolution
     */
    AwaitingResolution = 2,
    /**
     * Dispute was resolved by respondent and awaits for requester's confirmation
     */
    AwaitingConfirmation = 3,
    /**
     * Dispute was closed by requester after acceptance period has expired
     */
    ClosedAfterAcceptanceExpired = 4,
    /**
     * Dispute was closed by requester after resolution period has expired
     */
    ClosedAfterResolutionExpired = 5,
    /**
     * Dispute was closed by requester after confirmation period has expired
     */
    ClosedAfterConfirmationExpired = 6,
    /**
     * Dispute was closed by requester after respondent's resolution
     */
    Closed = 7
}
