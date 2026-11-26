// The use-case pages for the Astro site (/use-case/<slug>): the page reads its content by slug in the browser.
import UseCasePage from './UseCasePage';
import { USECASES } from './usecases/index.js';
export default function UseCaseRoute({ slug }) { return <UseCasePage data={USECASES[slug]} />; }
