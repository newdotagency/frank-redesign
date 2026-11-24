// The "Frank vs …" pages for the Astro site (/competitors/<slug>). CompetitorPage gets its data here, in the browser, by
// slug: passed as a prop from the .astro page, Astro serialises it for hydration and fails to read it back
// ("t is not iterable", the data holds an imported logo), which left the page blank.
import CompetitorPage from './CompetitorPage';
import conveo from './competitors/conveo';
import listenLabs from './competitors/listenLabs';
import outset from './competitors/outset';
import strella from './competitors/strella';

const DATA = { conveo, 'listen-labs': listenLabs, outset, strella };

export default function CompetitorRoute({ slug }) {
  return <CompetitorPage c={DATA[slug]} />;
}
