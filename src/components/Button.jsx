import './Button.css';

// variant: primary | secondary | danger | success | outline
// Renders a standard <button> by default. Pass `type="submit"` via props
// when used inside a form.
export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon size={17} className="btn__icon" aria-hidden="true" />
      )}
      <span>{loading ? 'Please wait…' : children}</span>
    </button>
  );
}
