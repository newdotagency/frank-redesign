// The Benefits pages for the Astro site (/benefits/<slug>): the page reads its content by slug in the browser.
import BenefitPage from './BenefitPage';
export default function BenefitRoute({ slug }) { return <BenefitPage slug={slug} />; }
