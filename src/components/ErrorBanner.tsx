import type { ApiError } from "../types/github";

export interface ErrorBannerProps {
  error: ApiError;
}

// Renders the user-facing message for a failed search, chosen by the semantic
// `error.type` — never by the raw HTTP status, so GitHub's status codes stay out
// of the UI. Skeleton for now: only the fallback arm exists. Per-type messages
// (service_down first) and the retry button land in the next steps.
export const ErrorBanner = ({ error }: ErrorBannerProps) => {
  switch (error.type) {
    default:
      return (
        <div className="mt-4 text-left text-red-600">
          <p>Something went wrong.</p>
        </div>
      );
  }
};
