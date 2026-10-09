import Aurora from './reactbits/Aurora/Aurora';
import DotGrid from './reactbits/DotGrid/DotGrid';
import type { ThemeMode } from '../hooks/useTheme';

/**
 * Full-page ambient backdrop, fixed behind all sections:
 * a slow drifting Aurora wash + a subtle interactive DotGrid texture.
 */
export default function AmbientBackground({ theme }: { theme: ThemeMode }) {
  const dark = theme === 'dark';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Aurora
        colorStops={dark ? ['#6366f1', '#a855f7', '#22d3ee'] : ['#BFDBFE', '#DDD6FE', '#99F6E4']}
        amplitude={dark ? 1.6 : 1.4}
        blend={0.6}
        speed={0.45}
        lightMode={!dark}
      />
      <div className={`absolute inset-0 ${dark ? 'opacity-60' : 'opacity-80'}`}>
        <DotGrid
          dotSize={2}
          gap={30}
          baseColor={dark ? '#2a2a31' : '#dcdce0'}
          activeColor={dark ? '#818cf8' : '#6366f1'}
          proximity={130}
          speedTrigger={80}
          shockRadius={220}
          shockStrength={4}
          maxSpeed={4000}
        />
      </div>
    </div>
  );
}
