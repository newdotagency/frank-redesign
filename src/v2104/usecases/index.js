// The use-case pages built on ./../UseCasePage.jsx, by slug (/use-case/<slug>). Churn keeps its own page (ChurnPage.jsx).
import { DISCOVERY } from './discovery';
import { FEATURE } from './feature';
import { PRODUCT } from './product';
import { MARKET } from './market';
import { WINLOSS } from './winloss';

export const USECASES = Object.fromEntries([DISCOVERY, PRODUCT, FEATURE, MARKET, WINLOSS].map(d => [d.slug, d]));
