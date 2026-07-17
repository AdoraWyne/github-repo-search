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
    case "service_down":
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>
            GitHub is temporarily unavailable.
            <button type="button" className="mt-2 text-pink-500 underline">
              Retry
            </button>
          </p>
        </div>
      );
    default:
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>
            Something went wrong.
            <button type="button" className="mt-2 text-pink-500 underline">
              Retry
            </button>
          </p>
        </div>
      );
  }
};
