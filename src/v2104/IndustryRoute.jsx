// The Industries pages for the Astro site (/industries/<slug>): the page reads its content by slug in the browser.
import IndustryPage from './IndustryPage';
export default function IndustryRoute({ slug }) { return <IndustryPage slug={slug} />; }
