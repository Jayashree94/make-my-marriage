type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="state-panel error" role="alert">
      <strong>Something went wrong.</strong>
      <p>{message}</p>
    </div>
  );
}
