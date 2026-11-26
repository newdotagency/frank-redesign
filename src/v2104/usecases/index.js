// The use-case pages built on ./../UseCasePage.jsx (the doc's template), by slug (/use-case/<slug>). Churn keeps its own page (ChurnPage.jsx); Product,
// Feature and Market discovery and Win/loss are copied from the live site (./live.json, ../LiveUseCasePage.jsx).
import { DISCOVERY } from './discovery';
import { ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT, UPGRADE } from './templates';

export const USECASES = Object.fromEntries([DISCOVERY, ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT, UPGRADE].map(d => [d.slug, d]));
