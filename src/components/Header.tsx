import { profile } from '../data';
import { PillButton, PillLink } from './Pill';

type Props = { onMenu: (trigger: HTMLElement) => void };

// Sticks for the whole page, so navigation never floats over the text the way a floating button would.
export default function Header({ onMenu }: Props) {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 flex h-(--header-h) items-center justify-between gap-4 border-b border-line bg-canvas px-6 md:px-12 wide:pr-[200px]"
    >
      <a
        href="#home"
        className="inline-flex min-h-11 items-center text-lg tracking-[-0.02em] whitespace-nowrap md:text-2xl"
      >
        {profile.shortName}
      </a>
      <div className="flex items-center gap-2">
        {/* Below 360px there is no room for this next to the name. The menu holds the same link. */}
        <PillLink href={`mailto:${profile.email}`} tone="dark" className="max-[359px]:hidden">
          <span className="sm:hidden">Email</span>
          <span className="hidden sm:inline">Email me</span>
        </PillLink>
        <PillButton onClick={event => onMenu(event.currentTarget)} aria-haspopup="dialog">
          Menu
        </PillButton>
      </div>
    </header>
  );
}
