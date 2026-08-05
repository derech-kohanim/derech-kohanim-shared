/**
 * Account and data deletion requests. A request is a record of someone asking for their account
 * and its data to be removed: it is never the deletion itself, so an operator can verify the
 * requester before anything is destroyed.
 */

/** Which client raised the request. */
export type DeletionRequestSource = 'web' | 'android';

export type DeletionRequestStatus = 'pending' | 'completed' | 'rejected';

export interface DeletionRequest {
  id: string;
  /** The account the email resolved to, null when no account matched it. */
  userId: string | null;
  email: string;
  /** True when the request arrived from a signed-in session, so the address is proven. */
  verified: boolean;
  reason: string | null;
  status: DeletionRequestStatus;
  source: DeletionRequestSource;
  /** Free text an operator left when resolving the request. */
  note: string | null;
  /** Email of the operator who resolved it. */
  handledBy: string | null;
  handledAt: string | null;
  createdAt: string;
}

export interface CreateDeletionRequest {
  email: string;
  reason?: string;
  source?: DeletionRequestSource;
}

/**
 * What the public endpoint returns. Deliberately says nothing about whether an account exists
 * for the address, so the form cannot be used to probe for registered emails.
 */
export interface DeletionRequestReceipt {
  id: string;
  status: DeletionRequestStatus;
  createdAt: string;
}
