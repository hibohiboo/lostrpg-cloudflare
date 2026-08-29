import {
  faCheckCircle,
  faClock,
  faGem,
  faImage,
} from '@fortawesome/free-regular-svg-icons';
import {
  faDice,
  faDragon,
  faExclamationTriangle,
  faFlask,
  faGhost,
  faHourglassHalf,
  faHourglassStart,
  faListOl,
  faLock,
  faSearch,
  faShoePrints,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ScenarioNotationIconKey } from '@lostrpg/core/game-data/scenario';

// 記法例ページ（アイコン列）で使用するFont Awesomeアイコンのマッピング
// 参考: create-now版 src/data/lostrpg.ts の sampleTable
export const SCENARIO_NOTATION_ICONS: Record<ScenarioNotationIconKey, IconDefinition> = {
  players: faUserFriends,
  time: faClock,
  limit: faHourglassHalf,
  caution: faExclamationTriangle,
  checkpoint: faCheckCircle,
  path: faShoePrints,
  view: faImage,
  battle: faGhost,
  lock: faLock,
  search: faSearch,
  limitUp: faHourglassStart,
  boss: faDragon,
  roll: faDice,
  item: faFlask,
  prize: faGem,
  table: faListOl,
};
