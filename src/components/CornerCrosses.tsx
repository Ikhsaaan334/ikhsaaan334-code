// The four marks that sit on the corners of a stage panel.
const positions = ['-top-5 -left-5', '-top-5 -right-5', '-bottom-5 -left-5', '-bottom-5 -right-5'];

export default function CornerCrosses() {
  return positions.map(position => <span key={position} className={`cross ${position}`} aria-hidden="true" />);
}
