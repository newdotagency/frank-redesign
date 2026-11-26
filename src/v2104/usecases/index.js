// The use-case pages built on ./../UseCasePage.jsx, by slug (/use-case/<slug>). Churn keeps its own page (ChurnPage.jsx).
import { DISCOVERY } from './discovery';
import { FEATURE } from './feature';
import { PRODUCT } from './product';
import { MARKET } from './market';
import { WINLOSS } from './winloss';
import { ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT } from './templates-a';
import { UPGRADE, REQUESTS, VALUE, CHECKOUT, DOWNGRADE } from './templates-b';

export const USECASES = Object.fromEntries([DISCOVERY, PRODUCT, FEATURE, MARKET, WINLOSS, ACTIVATION, TRIAL, ADOPTION, FUNNEL, ENGAGEMENT, UPGRADE, REQUESTS, VALUE, CHECKOUT, DOWNGRADE].map(d => [d.slug, d]));

