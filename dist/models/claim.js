"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus[ClaimStatus["Null"] = 0] = "Null";
    /**
     * Dispute was opened by requester and awaits respondent's acceptance
     */
    ClaimStatus[ClaimStatus["AwaitingAcceptance"] = 1] = "AwaitingAcceptance";
    /**
     * Dispute was accepted by respondent and awaits for respondent's resolution
     */
    ClaimStatus[ClaimStatus["AwaitingResolution"] = 2] = "AwaitingResolution";
    /**
     * Dispute was resolved by respondent and awaits for requester's confirmation
     */
    ClaimStatus[ClaimStatus["AwaitingConfirmation"] = 3] = "AwaitingConfirmation";
    /**
     * Dispute was closed by requester after acceptance period has expired
     */
    ClaimStatus[ClaimStatus["ClosedAfterAcceptanceExpired"] = 4] = "ClosedAfterAcceptanceExpired";
    /**
     * Dispute was closed by requester after resolution period has expired
     */
    ClaimStatus[ClaimStatus["ClosedAfterResolutionExpired"] = 5] = "ClosedAfterResolutionExpired";
    /**
     * Dispute was closed by requester after confirmation period has expired
     */
    ClaimStatus[ClaimStatus["ClosedAfterConfirmationExpired"] = 6] = "ClosedAfterConfirmationExpired";
    /**
     * Dispute was closed by requester after respondent's resolution
     */
    ClaimStatus[ClaimStatus["Closed"] = 7] = "Closed";
})(ClaimStatus = exports.ClaimStatus || (exports.ClaimStatus = {}));
