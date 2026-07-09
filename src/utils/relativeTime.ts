interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
}

/**
 * Formats how long ago a repo was updated as a human-readable string,
 * relative to a reference time. Within 7 days it counts down in the
 * largest whole unit (days → hours → minutes); beyond that it falls back
 * to the absolute date in en-AU locale.
 *
 * @param dateNow - the reference time, in epoch milliseconds (e.g. Date.now())
 * @param updatedAtTime - the repo's last-updated timestamp, as an ISO date string
 * @returns a display string such as "Updated 3 days ago"
 *
 * @example
 *   const now = Date.parse("2026-07-09T12:00:00Z");
 *   relativeTime(now, "2026-07-09T11:59:30Z"); // "Updated less than 1 minute ago"
 *   relativeTime(now, "2026-07-09T11:45:00Z"); // "Updated 15 minutes ago"
 *   relativeTime(now, "2026-07-09T09:00:00Z"); // "Updated 3 hours ago"
 *   relativeTime(now, "2026-07-06T12:00:00Z"); // "Updated 3 days ago"
 *   relativeTime(now, "2026-01-01T12:00:00Z"); // "Updated 1 January 2026"
 *   relativeTime(now, "2026-07-10T12:00:00Z"); // "Repo is updated in the future time."
 */
export function relativeTime(dateNow: number, updatedAtTime: string): string {
  // find out the diff in epoch ms
  const updatedAtDateEpochMs = Date.parse(updatedAtTime);
  const diff = dateNow - updatedAtDateEpochMs;

  // Guard against negative diff and early return
  if (diff < 0) {
    return "Repo is updated in the future time.";
  }

  // convert diff into days, hours, mins object
  const diffObj = convertMs(diff);

  // if more than 7 days, just returns the date itself
  if (diffObj.days >= 7)
    return `Updated ${new Date(updatedAtTime).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;

  // otherwise, returns the days/hours/mins
  return `Updated ${convertPlaceholder(diffObj)} ago`;
}

function convertMs(ms: number): TimeDiff {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  return { days, hours, minutes };
}

function convertPlaceholder(diffObject: TimeDiff): string {
  // less than 60 minutes
  if (
    diffObject.days === 0 &&
    diffObject.hours === 0 &&
    diffObject.minutes > 0
  ) {
    const label = diffObject.minutes === 1 ? "minute" : "minutes";
    return `${diffObject.minutes} ${label}`;
  }
  // less than 24 hours
  else if (diffObject.days === 0 && diffObject.hours > 0) {
    const label = diffObject.hours === 1 ? "hour" : "hours";
    return `${diffObject.hours} ${label}`;
  }
  // less than 7 days
  else if (diffObject.days > 0) {
    const label = diffObject.days === 1 ? "day" : "days";
    return `${diffObject.days} ${label}`;
    // less than 1 minute
  } else {
    return "less than 1 minute";
  }
}
