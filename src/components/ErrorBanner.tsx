import type { ApiError } from "../types/github";

export interface ErrorBannerProps {
  error: ApiError;
  onRetry: () => void;
}

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
    // re-running the identical request would just fail again.
    case "invalid_query":
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>That search couldn&apos;t be processed. Try a shorter query.</p>
        </div>
      );
    case "rate_limited":
      return (
        <div role="alert" className="mt-4 text-left text-gray-700">
          <p>
            Rate limit hit. Try again in a few moments.{" "}
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-pink-500 underline"
            >
              Try again
            </button>
          </p>
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
