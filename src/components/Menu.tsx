import { useEffect, useImperativeHandle, useRef, type KeyboardEvent, type MouseEvent, type Ref } from 'react';
import { profile, sections } from '../data';
import { getLenis, scrollToSection } from '../lib/scroll';
import { PillButton, PillLink } from './Pill';

export type MenuHandle = { open: (trigger?: HTMLElement) => void };

type Props = { menuRef: Ref<MenuHandle> };

// A modal dialog makes the rest of the page inert but still lets Tab leave at either end, so wrap it here.
function trapTab(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)'));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  if (!event.currentTarget.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export default function Menu({ menuRef }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openMenu = (trigger?: HTMLElement) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // Browsers only restore focus to whatever was focused before, and a clicked button is not always that.
    openerRef.current = trigger ?? null;
    getLenis()?.stop();
    dialog.showModal();
  };

  useImperativeHandle(menuRef, () => ({ open: openMenu }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      getLenis()?.start();
      openerRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    dialogRef.current?.close();
    scrollToSection(id);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="menu-title"
      onKeyDown={trapTab}
      className="m-0 max-h-dvh w-screen max-w-none border-0 bg-canvas p-0 text-ink"
    >
      {/* Exactly one viewport tall: on a short screen the list scrolls inside the menu instead of running off it. */}
      <div className="flex h-dvh flex-col gap-10 overflow-y-auto px-6 py-5 md:px-12" data-lenis-prevent>
        <div className="flex items-center justify-between">
          {/* A label, not a heading: the closed menu sits before the h1 in document order. */}
          <p id="menu-title" className="font-mono text-xs tracking-[0.04em] text-ink-soft uppercase">
            Menu
          </p>
          <PillButton onClick={() => dialogRef.current?.close()}>Close</PillButton>
        </div>

        <nav aria-label="Sections">
          <ol>
            {sections.map((section, index) => (
              <li key={section.id} className="border-b border-line first:border-t">
                {/* Sized by the height of the viewport, so the whole menu fits on a laptop screen. */}
                <a
                  href={`#${section.id}`}
                  onClick={event => go(event, section.id)}
                  className="flex items-baseline gap-4 py-3 text-5xl tracking-[-0.03em] transition-colors duration-200 hover:text-cyan-ink md:text-[clamp(3.5rem,8.5vh,6rem)]"
                >
                  <span className="font-mono text-xs tracking-[0.04em] text-ink-soft">0{index + 1}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ul className="mt-auto flex flex-wrap gap-3">
          <li>
            <PillLink href={`mailto:${profile.email}`} tone="dark">
              Email me
            </PillLink>
          </li>
          <li>
            <PillLink href={profile.github}>GitHub</PillLink>
          </li>
          <li>
            <PillLink href={profile.linkedin}>LinkedIn</PillLink>
          </li>
          <li>
            <PillLink href={profile.cv} target="_blank">
              Download CV
            </PillLink>
          </li>
        </ul>
      </div>
    </dialog>
  );
}
