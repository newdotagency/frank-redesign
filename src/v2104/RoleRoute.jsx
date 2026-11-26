// The Roles pages for the Astro site (/roles/<slug>): the page reads its content by slug in the browser.
import RolePage from './RolePage';
export default function RoleRoute({ slug }) { return <RolePage slug={slug} />; }
