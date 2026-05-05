interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
}

export function relativeTime(dateNow: number, updatedAtTime: string): string {
  // find out the diff in epoch ms
  const updatedAtDateEpochMs = Date.parse(updatedAtTime);
  const diff = dateNow - updatedAtDateEpochMs;

  // convert diff into days, hours, mins object
  const diffObj = convertMs(diff);

  // if more than 7 days, just returns the date itself
  if (diffObj.days >= 7)
    return new Date(updatedAtTime).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // otherwise, returns the days/hours/mins
  return convertPlaceholder(diffObj);
}

function convertMs(ms: number): TimeDiff {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  return { days, hours, minutes };
}

function convertPlaceholder(diffObject: TimeDiff): string {
  // Guard against negatiev diff
  if (diffObject.days < 0 || diffObject.hours < 0 || diffObject.minutes < 0) {
    return "Repo is updated in the future time.";
  }

  if (
    diffObject.days === 0 &&
    diffObject.hours === 0 &&
    diffObject.minutes > 0
  ) {
    const label = diffObject.minutes === 1 ? "minute" : "minutes";
    return `${diffObject.minutes} ${label}`;
  } else if (diffObject.days === 0 && diffObject.hours > 0) {
    const label = diffObject.hours === 1 ? "hour" : "hours";
    return `${diffObject.hours} ${label}`;
  } else if (diffObject.days > 0) {
    const label = diffObject.days === 1 ? "day" : "days";
    return `${diffObject.days} ${label}`;
  } else {
    return "1 minute";
  }
}
