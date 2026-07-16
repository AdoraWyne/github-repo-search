export interface EmptyStateProps {
  query: string;
}

export const EmptyState = ({ query }: EmptyStateProps) => {
  return (
    <div className="mt-4 text-left text-gray-500">
      <p>No repositories matched '{query}'. Try a different search.</p>
    </div>
  );
};
