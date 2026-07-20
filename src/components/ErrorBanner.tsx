import type { ApiError, ApiErrorType } from "../types/github";

export interface ErrorBannerProps {
  error: ApiError;
  onRetry: () => void;
}

interface ErrorPresentation {
  message: string;
  retryLabel: string | null;
}

const presentationFor = (type: ApiErrorType): ErrorPresentation => {
  switch (type) {
    case "service_down":
      return {
        message: "GitHub is temporarily unavailable.",
        retryLabel: "Retry",
      };
    case "invalid_query":
      return {
        message: "That search couldn't be processed. Try a shorter query.",
        retryLabel: null,
      };
    case "rate_limited":
      return {
        message: "Rate limit hit. Try again in a few moments.",
        retryLabel: "Try again",
      };
    default:
      return { message: "Something went wrong.", retryLabel: "Retry" };
  }
};

export const ErrorBanner = ({ error, onRetry }: ErrorBannerProps) => {
  const { message, retryLabel } = presentationFor(error.type);

  return (
    <div role="alert" className="mt-4 text-left text-gray-700">
      <p>
        {message}
        {retryLabel && (
          <>
            {" "}
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-pink-500 underline"
            >
              {retryLabel}
            </button>
          </>
        )}
      </p>
    </div>
  );
};
