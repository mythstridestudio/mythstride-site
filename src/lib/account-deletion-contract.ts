/**
 * Future account-deletion integration boundary.
 *
 * There is deliberately no implementation, endpoint or exported service
 * instance in the website. A future runtime may implement this contract only
 * after the backend workflow, identity verification and approved policy agree.
 */
export type AccountDeletionRequest = {
  authenticatedAccountId: string;
  confirmationToken: string;
};

export type AccountDeletionReceipt = {
  requestId: string;
  acceptedAt: string;
};

export interface AccountDeletionService {
  requestDeletion(
    request: AccountDeletionRequest,
  ): Promise<AccountDeletionReceipt>;
}

export const accountDeletionIntegration = {
  active: false,
  channel: "in-app",
} as const;
