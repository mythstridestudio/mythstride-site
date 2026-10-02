import { ApiConfigurationError, ApiError, ApiNetworkError, apiFetch } from "./client";
import { API_ENDPOINTS } from "./endpoints";

/**
 * Public, non-enumerating password-recovery flow. Matches the mobile app's
 * contract against MythStrideApi's AuthController: POST /api/auth/forgot-password
 * always answers with the same generic message regardless of whether the
 * email is registered (only HTTP 429 is distinguishable, since throttling is
 * a fact about the request, not the account), and POST /api/auth/reset-password
 * consumes the 6-digit code to set a new password.
 */

export type RequestPasswordResetOutcome = "sent" | "rateLimited" | "unavailable";

export async function requestPasswordResetCode(
  email: string,
): Promise<RequestPasswordResetOutcome> {
  try {
    await apiFetch<unknown>(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return "sent";
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return "rateLimited";
    }

    // Any other server response (including validation errors, which the
    // caller should have already prevented) is reported identically to
    // success so this endpoint can never be used to probe which emails are
    // registered.
    if (error instanceof ApiError) {
      return "sent";
    }

    if (error instanceof ApiConfigurationError || error instanceof ApiNetworkError) {
      return "unavailable";
    }

    throw error;
  }
}

export interface ResetPasswordWithCodeRequest {
  email: string;
  code: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export type ResetPasswordOutcome = "success" | "invalidCode" | "rateLimited" | "unavailable";

export async function resetPasswordWithCode(
  request: ResetPasswordWithCodeRequest,
): Promise<ResetPasswordOutcome> {
  try {
    await apiFetch<unknown>(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        codigo: request.code,
        newPassword: request.newPassword,
        newPasswordConfirm: request.newPasswordConfirm,
      }),
    });

    return "success";
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return "rateLimited";
    }

    if (error instanceof ApiError) {
      return "invalidCode";
    }

    if (error instanceof ApiConfigurationError || error instanceof ApiNetworkError) {
      return "unavailable";
    }

    throw error;
  }
}
