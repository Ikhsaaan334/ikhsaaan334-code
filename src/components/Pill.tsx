import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type Tone = 'dark' | 'light' | 'stage' | 'outline';

const tones: Record<Tone, string> = {
  dark: 'bg-ink text-canvas hover:bg-cyan-ink',
  light: 'border border-ink-soft bg-pill text-ink hover:bg-ink hover:text-canvas',
  stage: 'bg-canvas text-ink hover:bg-cyan',
  outline: 'border border-stage-soft text-canvas hover:bg-canvas hover:text-ink',
};

const base =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 font-mono text-xs uppercase tracking-[0.04em] whitespace-nowrap transition-colors duration-200 active:translate-y-px sm:px-5';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: Tone };
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone };

export function PillLink({ tone = 'light', className = '', ...rest }: LinkProps) {
  const external = rest.href && /^https?:/.test(rest.href);
  return (
    <a
      className={`${base} ${tones[tone]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    />
  );
}

export function PillButton({ tone = 'light', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={`${base} ${tones[tone]} ${className}`} {...rest} />;
}
