import { featuredProjects, moreProjects, profile, type Project } from '../data';
import Headline from '../components/Headline';

type Ground = NonNullable<Project['cover']>['ground'];

const grounds: Record<Ground, string> = {
  cyan: 'bg-cyan text-ink',
  stage: 'bg-stage text-canvas',
  canvas: 'border border-line bg-canvas text-ink',
};

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

// The arrow marks links that leave the site; internal links never carry one.
const linkLook =
  'underline decoration-ink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:text-cyan-ink';
// A standalone link is a real 44px tall box. One inside a heading keeps its line and gets a taller hit area instead.
const textLink = `inline-flex min-h-11 items-center ${linkLook}`;
const inlineLink = `tap-target ${linkLook}`;

// One tag per list item: a written separator would dangle at the start of a wrapped line.
function Tags({ tags, className = '' }: { tags: string[]; className?: string }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs tracking-[0.04em] text-ink-soft uppercase ${className}`}
    >
      {tags.map(tag => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function FeaturedCard({ project, index, total }: { project: Project; index: number; total: number }) {
  if (!project.cover) return null;
  return (
    <article>
      <a
        href={project.repo}
        {...external}
        aria-label={`${project.title} on GitHub`}
        className="group block"
      >
        <div className={`relative aspect-[16/10] overflow-hidden rounded-[20px] ${grounds[project.cover.ground]}`}>
          <span className="absolute top-4 left-5 font-mono text-xs tracking-[0.04em] uppercase">
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <img
            src={project.cover.mark}
            alt=""
            width="220"
            height="220"
            className="absolute top-[44%] right-[7%] w-[30%] max-w-[240px] -translate-y-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-[54%] group-hover:rotate-6"
          />
          <h3 className="absolute right-5 bottom-4 left-5 text-3xl leading-none tracking-[-0.03em] md:text-5xl">
            {project.title}
          </h3>
        </div>
      </a>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{project.blurb}</p>
      <Tags tags={project.stack} className="mt-4" />
      <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-0 text-lg">
        <li>
          <a href={project.repo} {...external} className={textLink}>
            GitHub ↗
          </a>
        </li>
        {project.demo && (
          <li>
            <a href={project.demo} {...external} className={textLink}>
              Live demo ↗
            </a>
          </li>
        )}
      </ul>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Headline
          as="h2"
          className="text-[2.5rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem]"
          lines={[{ text: 'Selected' }, { text: 'projects', className: 'lg:pl-[14%]' }]}
        />
        <p className="max-w-xs font-mono text-xs leading-relaxed tracking-[0.04em] text-ink-soft uppercase">
          {featuredProjects.length} builds I can walk through in detail. The rest is on GitHub.
        </p>
      </div>

      <ul className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <li key={project.id}>
            <FeaturedCard project={project} index={index + 1} total={featuredProjects.length} />
          </li>
        ))}
      </ul>

      <div className="mt-28 grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h3 className="text-4xl leading-[0.95] tracking-[-0.03em] md:text-5xl">More from GitHub</h3>
          <a href={`${profile.github}?tab=repositories`} {...external} className={`mt-2 text-lg ${textLink}`}>
            All repositories ↗
          </a>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {moreProjects.map(project => (
            <li key={project.id} className="grid gap-x-8 gap-y-3 border-b border-line py-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <h4 className="text-xl leading-snug tracking-[-0.01em] md:text-2xl">
                  <a href={project.repo} {...external} className={inlineLink}>
                    {project.title}
                  </a>
                </h4>
                <p className="mt-2 leading-relaxed text-ink-soft">{project.blurb}</p>
              </div>
              <Tags tags={project.stack} className="md:col-span-3" />
              <div className="flex flex-col gap-2 md:col-span-2 md:items-end">
                {project.demo && (
                  <a href={project.demo} {...external} className={inlineLink}>
                    Live demo ↗
                  </a>
                )}
                {project.status && <p className="text-ink-soft">{project.status}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
