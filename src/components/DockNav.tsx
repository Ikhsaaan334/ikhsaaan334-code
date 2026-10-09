import {
  MdDarkMode,
  MdDownload,
  MdFolder,
  MdHome,
  MdLayers,
  MdLightMode,
  MdMail,
  MdPerson,
  MdTimeline,
  MdWorkspacePremium,
} from 'react-icons/md';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Dock, { type DockItemData } from '../components/reactbits/Dock/Dock';
import { navSections, profile } from '../data';
import { scrollToSection } from '../lib/scroll';

const sectionIcons: Record<string, React.ReactNode> = {
  home: <MdHome className="h-5 w-5" />,
  about: <MdPerson className="h-5 w-5" />,
  journey: <MdTimeline className="h-5 w-5" />,
  stack: <MdLayers className="h-5 w-5" />,
  projects: <MdFolder className="h-5 w-5" />,
  certs: <MdWorkspacePremium className="h-5 w-5" />,
  contact: <MdMail className="h-5 w-5" />,
};

interface DockNavProps {
  activeId: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function DockNav({ activeId, theme, onToggleTheme }: DockNavProps) {
  const items: DockItemData[] = [
    ...navSections.map(s => ({
      icon: sectionIcons[s.id],
      label: s.label,
      onClick: () => scrollToSection(s.id),
      active: activeId === s.id,
    })),
    { separator: true },
    {
      icon:
        theme === 'dark' ? (
          <MdLightMode className="h-5 w-5" />
        ) : (
          <MdDarkMode className="h-5 w-5" />
        ),
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      onClick: onToggleTheme,
    },
    {
      icon: <FaGithub className="h-[18px] w-[18px]" />,
      label: 'GitHub',
      href: profile.github,
    },
    {
      icon: <FaLinkedin className="h-[18px] w-[18px]" />,
      label: 'LinkedIn',
      href: profile.linkedin,
    },
    { separator: true },
    {
      icon: <MdDownload className="h-5 w-5" />,
      label: 'Download CV',
      href: profile.cv,
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden h-0 md:block">
      <Dock
        items={items}
        position="bottom"
        theme={theme}
        baseItemSize={42}
        magnification={62}
        distance={150}
        panelHeight={58}
        gap={8}
        accentColor={theme === 'dark' ? '#fafafa' : '#0b0b0f'}
        className="pointer-events-auto"
      />
    </div>
  );
}
