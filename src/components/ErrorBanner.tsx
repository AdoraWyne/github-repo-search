import type { ApiError } from "../types/github";

export interface ErrorBannerProps {
  error: ApiError;
  onRetry: () => void;
}

// Renders the user-facing message for a failed search, chosen by the semantic
// `error.type` — never by the raw HTTP status, so GitHub's status codes stay out
// of the UI. Skeleton for now: only the fallback arm exists. Per-type messages
// (service_down first) and the retry button land in the next steps.
export const ErrorBanner = ({ error, onRetry }: ErrorBannerProps) => {
  switch (error.type) {
    case "service_down":
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>
            GitHub is temporarily unavailable.{" "}
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-pink-500 underline"
            >
              Retry
            </button>
          </p>
        </div>
      );
    // No Retry button here: a 422 means the query itself is the problem, so
    // re-running the identical request would just fail again. The action lives
    // with the user — change the query — which the message spells out.
    case "invalid_query":
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>That search couldn&apos;t be processed. Try a shorter query.</p>
        </div>
      );
    default:
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>
            Something went wrong.
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-pink-500 underline"
            >
              Retry
            </button>
          </p>
        </div>
      );
  }
};
