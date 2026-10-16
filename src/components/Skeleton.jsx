import './Skeleton.css';

// A shimmering placeholder block. Usage: <Skeleton width="60%" height={14} />
// Used while demo data is "loading" (simulated) on Transfer/QR/Transactions.
export default function Skeleton({ width = '100%', height = 14, radius = 6, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
