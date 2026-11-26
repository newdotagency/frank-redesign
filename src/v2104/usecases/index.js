// The use-case pages built on ./../UseCasePage.jsx, by slug (/use-case/<slug>). Churn keeps its own page (ChurnPage.jsx).
import { DISCOVERY } from './discovery';
import { FEATURE } from './feature';
import { PRODUCT } from './product';
import { MARKET } from './market';
import { WINLOSS } from './winloss';
import { ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT, UPGRADE } from './templates';

export const USECASES = Object.fromEntries([DISCOVERY, PRODUCT, FEATURE, MARKET, WINLOSS, ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT, UPGRADE].map(d => [d.slug, d]));
