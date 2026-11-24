// The Frank vs Listen Labs page for the Astro site. CompetitorPage gets its data here, in the browser: passed as a
// prop from the .astro page, Astro serialises it for hydration and fails to read it back ("t is not iterable"), which
// left the page blank.
import CompetitorPage from './CompetitorPage';
import listenLabs from './competitors/listenLabs';

export default function ListenLabsPage() {
  return <CompetitorPage c={listenLabs} />;
}
