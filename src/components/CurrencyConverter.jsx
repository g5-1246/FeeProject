
import { useEffect, useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import Card from './Card.jsx';
import './CurrencyConverter.css';

const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function getRate() {
      if (from === to) {
        setRate(1);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Could not fetch exchange rate.');
        }

        const data = await response.json();
        const currentRate = data.rates?.[to];

        if (typeof currentRate !== 'number') {
          throw new Error('Exchange rate unavailable.');
        }

        setRate(currentRate);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Unable to load rate. Check your internet.');
          setRate(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getRate();

    return () => controller.abort();
  }, [from, to, retry]);

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  const validAmount =
    amount.trim() !== '' &&
    Number.isFinite(Number(amount)) &&
    Number(amount) >= 0;

  return (
    <Card
      title="Currency Converter"
      subtitle="Check the latest available exchange rate"
      className="currency-card"
    >
      <div className="currency-converter">
        <label>
          Amount
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <div className="currency-row">
          <label>
            From
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="swap-button"
            onClick={swapCurrencies}
            aria-label="Swap currencies"
          >
            <ArrowLeftRight size={18} />
          </button>

          <label>
            To
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p>Loading exchange rate...</p>}

        {error && (
          <div className="currency-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetry((n) => n + 1)}
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        )}

        {!loading && !error && rate !== null && (
          <div className="currency-result" aria-live="polite">
            <p>Converted amount</p>
            <h2>
              {validAmount
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: to,
                  }).format(Number(amount) * rate)
                : 'Enter a valid amount'}
            </h2>
            <p>
              1 {from} = {rate.toFixed(4)} {to}
            </p>
          </div>
        )}

        <small>
          Indicative exchange rate only. No real bank transfer is performed.
        </small>
      </div>
    </Card>
  );
}
