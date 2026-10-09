import ScrollFloat from '../components/reactbits/ScrollFloat/ScrollFloat';

interface SectionHeadingProps {
  title: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, align = 'left' }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mb-12 text-center md:mb-16' : 'mb-12 md:mb-16'}>
      <ScrollFloat
        containerClassName={centered ? 'my-0 flex justify-center' : 'my-0'}
        textClassName="font-display font-semibold tracking-tight text-ink"
        scrollStart="top bottom+=30%"
        scrollEnd="top 65%"
      >
        {title}
      </ScrollFloat>
    </div>
  );
}
