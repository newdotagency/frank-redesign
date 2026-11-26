// The use-case pages for the Astro site (/use-case/<slug>): the page reads its content by slug in the browser.
// Most are on the doc's template (UseCasePage); Product, Feature and Market discovery and Win/loss are copied from the live pages (LiveUseCasePage).
import UseCasePage from './UseCasePage';
import LiveUseCasePage from './LiveUseCasePage';
import { USECASES } from './usecases/index.js';
import LIVE from './usecases/live.json';
export default function UseCaseRoute({ slug }) { return LIVE[slug] ? <LiveUseCasePage slug={slug} /> : <UseCasePage data={USECASES[slug]} />; }
