type BlobProps = {
  className?: string;
  from: string;
  to: string;
};

export default function Blob({ className = "", from, to }: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute animate-blob animate-float blur-3xl opacity-40 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    />
  );
}
