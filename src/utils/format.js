// Formats a number as Indian Rupee currency, e.g. 125450 -> "₹1,25,450.00"
export function formatINR(amount) {
  const number = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

// Masks all but the last N digits of an account number: "5021489934521" -> "XXXX XXXX X4521"
export function maskAccountNumber(accountNumber, visibleDigits = 4) {
  if (!accountNumber) return '';
  const str = String(accountNumber);
  const visible = str.slice(-visibleDigits);
  const maskedLength = str.length - visibleDigits;
  const groups = [];
  let remaining = maskedLength;
  while (remaining > 0) {
    groups.push('X'.repeat(Math.min(4, remaining)));
    remaining -= 4;
  }
  return `${groups.join(' ')} ${visible}`.trim();
}

// Formats an ISO date string into a readable format, e.g. "18 Mar 2021"
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
