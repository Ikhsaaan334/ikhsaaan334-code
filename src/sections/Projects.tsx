import type { ReactNode } from 'react';
import { BookOpen, Bot, Brain, Cloud, Code2, Hand, ScanFace, ShieldAlert, ShoppingCart } from 'lucide-react';
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import Carousel from '../components/reactbits/Carousel/Carousel';
import SectionHeading from '../components/SectionHeading';
import { projects } from '../data';

const icons: Record<string, ReactNode> = {
  cart: <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />,
  code: <Code2 className="h-6 w-6 md:h-7 md:w-7" />,
  face: <ScanFace className="h-6 w-6 md:h-7 md:w-7" />,
  shieldAlert: <ShieldAlert className="h-6 w-6 md:h-7 md:w-7" />,
  brain: <Brain className="h-6 w-6 md:h-7 md:w-7" />,
  book: <BookOpen className="h-6 w-6 md:h-7 md:w-7" />,
  cloud: <Cloud className="h-6 w-6 md:h-7 md:w-7" />,
  bot: <Bot className="h-6 w-6 md:h-7 md:w-7" />,
  sign: <Hand className="h-6 w-6 md:h-7 md:w-7" />,
};

export default function Projects() {
  const items = projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.tags,
    href: project.href,
    date: project.date,
    icon: icons[project.icon],
  }));

  return (
    <section id="projects" className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <SectionHeading title="Projects & Creations" />

      <AnimatedContent distance={40} duration={0.8} threshold={0.1}>
        <Carousel items={items} loop />
      </AnimatedContent>

      <p className="mt-6 text-center font-mono text-[10px] tracking-[0.18em] text-faint">
        drag or use the arrows to browse
      </p>
    </section>
  );
}
