// The redrawn "How it works" / "What Frank delivers" scenes of the feature and benefit pages (V21.04 colours, plain HTML and SVG), by set, so a page's
// data can pick one as "set.index" (for example 'speed.1', 'global.0'). Used by the Roles and live-copied use-case pages.
import { SPEED_SCENES } from './SpeedScenes';
import { SCALE_SCENES } from './ScaleScenes';
import { PRICE_SCENES } from './PriceScenes';
import { QUALITY_SCENES } from './QualityScenes';
import { SUMMARIES_SCENES } from './SummariesScenes';
import { TRANSPARENCY_SCENES } from './TransparencyScenes';
import { GLOBAL_SCENES } from './GlobalScenes';
import { ALWAYS_ON_SCENES } from './AlwaysOnScenes';

const SCENE_SETS = { speed: SPEED_SCENES, scale: SCALE_SCENES, price: PRICE_SCENES, quality: QUALITY_SCENES, summaries: SUMMARIES_SCENES, transparency: TRANSPARENCY_SCENES, global: GLOBAL_SCENES, alwayson: ALWAYS_ON_SCENES };

export const sceneOf = key => { const [set, i] = (key || '').split('.'); return SCENE_SETS[set]?.[+i]; };
