export function EmptyState({
  label,
  title,
  description,
  action,
}: {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      {label ? (
        <div className="label-mono mb-2 text-zinc-500">{label}</div>
      ) : null}
      <div className="text-base font-semibold text-zinc-900">{title}</div>
      {description ? (
        <div className="mt-2 text-sm text-zinc-600">{description}</div>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
