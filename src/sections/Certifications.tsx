import { certifications } from '../data';
import Headline from '../components/Headline';

export default function Certifications() {
  return (
    <section id="certs" className="py-24 md:py-40">
      <Headline
        as="h2"
        className="text-[2.5rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem]"
        lines={[{ text: 'Certificates' }]}
      />

      <ul className="mt-14 border-t border-line">
        {certifications.map(certificate => (
          <li
            key={certificate.title}
            className="grid items-center gap-x-8 gap-y-4 border-b border-line py-6 md:grid-cols-12"
          >
            {/* Issuer marks are wordmarks, so the box is wide enough to keep them legible. */}
            <img
              src={certificate.logo}
              alt=""
              width="144"
              height="40"
              className="h-10 w-36 object-contain object-left md:col-span-2"
            />
            <div className="md:col-span-5">
              <h3 className="text-xl leading-snug tracking-[-0.01em] md:text-2xl">{certificate.title}</h3>
              <p className="mt-1 leading-relaxed text-ink-soft">{certificate.text}</p>
            </div>
            <p className="font-mono text-xs leading-relaxed tracking-[0.04em] text-ink-soft uppercase md:col-span-3">
              {certificate.org}
              <br />
              {certificate.date}
            </p>
            <p className="flex md:col-span-2 md:justify-end">
              <a
                href={certificate.href ?? certificate.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-lg underline decoration-ink-soft decoration-2 underline-offset-4 transition-colors duration-200 hover:text-cyan-ink"
              >
                {certificate.href ? 'Verify credential ↗' : 'View certificate ↗'}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
