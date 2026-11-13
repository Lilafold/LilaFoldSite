/** Small authored icons, one 1.8px stroke family. */
export const ArrowRight = (props) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const Plus = (props) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
);

export const Minus = (props) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M3.5 8h9" />
  </svg>
);

/**
 * The fold: the logo's ribbon reduced to a mark. Two offset bands joined by a
 * darker crease, used as the site's bullet and divider motif.
 */
export const FoldMark = ({ className = "", ...props }) => (
  <svg className={`fold-mark ${className}`} viewBox="0 0 20 17" aria-hidden="true" {...props}>
    <path d="M2 6.2 15.5 1v4.6L2 10.8z" fill="#dcc6fd" />
    <path d="M2 10.8 15.5 5.6 18 6.6 4.5 11.8z" fill="#7656b8" />
    <path d="M4.5 11.8 18 6.6v4.6L4.5 16.4z" fill="#ebe2f1" opacity=".85" />
  </svg>
);
