import { FiLinkedin } from 'react-icons/fi';
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import ScrollFloat from '../components/reactbits/ScrollFloat/ScrollFloat';
import { certifications, profile } from '../data';

export default function Certifications() {
  return (
    <section id="certs" className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
        <div>
          <ScrollFloat
            containerClassName="my-0"
            textClassName="font-display font-semibold tracking-tight text-ink"
            scrollStart="top bottom+=30%"
            scrollEnd="top 65%"
          >
            Licenses &amp; Certifications
          </ScrollFloat>
        </div>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="mb-1 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 font-mono text-[11px] tracking-wider text-muted transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
        >
          <FiLinkedin className="h-3.5 w-3.5" /> view all on linkedin
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certifications.map((cert, i) => {
          const featured = i === 0;
          return (
            <AnimatedContent
              key={cert.title}
              distance={40}
              duration={0.7}
              delay={(i % 2) * 0.08}
              threshold={0.1}
              className={featured ? 'md:col-span-2' : ''}
            >
              <a
                href={cert.href ?? cert.pdf}
                target="_blank"
                rel="noreferrer noopener"
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[0_16px_40px_-32px_rgba(11,11,15,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,11,15,0.4)] ${
                  featured ? 'md:flex-row md:items-center md:gap-8 md:p-8' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.color}00)` }}
                />

                <div
                  className={`flex items-center justify-between gap-4 ${
                    featured ? 'mb-5 md:mb-0 md:shrink-0 md:flex-col md:items-start' : 'mb-5'
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-2xl border border-line bg-white p-2.5 ${
                      featured ? 'h-16 w-44' : 'h-14 w-40'
                    }`}
                  >
                    <img src={cert.logo} alt={`${cert.org} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {featured ? 'latest · ' : ''}
                    {cert.date}
                  </span>
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="font-display font-semibold tracking-tight text-ink">{cert.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cert.text}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[11px] tracking-wider text-muted">{cert.org}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink underline-offset-4 group-hover:underline">
                      {cert.href ? 'verify credential' : 'view certificate'}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </div>
              </a>
            </AnimatedContent>
          );
        })}
      </div>
    </section>
  );
}
