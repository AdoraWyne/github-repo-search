export const SkeletonCard = () => {
  return (
    // Mirrors RepoCard's container so the layout doesn't shift when real data arrives.
    // animate-pulse lives on the container so every grey block pulses in sync.
    // aria-hidden: the whole card is decorative — the "Loading…" announcement comes
    // from the role="status" region that wraps these, not from here.
    <div
      className="border border-solid border-pink-300 rounded-md p-4 animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      {/* Header: circular avatar + repo name */}
      <div className="flex items-center">
        <div className="w-7 h-7 mr-2 rounded-full bg-gray-200" />
        <div className="h-5 w-48 rounded bg-gray-200" />
      </div>

      {/* Description: two lines of varying width */}
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>

      {/* Footer: language · stars · updated */}
      <div className="mt-2 flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
};
