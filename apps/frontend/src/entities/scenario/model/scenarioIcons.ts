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
import { scenarioTypeLabels, type ScenarioNotationIconKey } from '@lostrpg/core/game-data/scenario';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// シナリオ関連画面（記法例ページ・構造編集フォーム等）で使用するFont Awesomeアイコンのマッピング
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

// シーン／イベント／項目の type（自由記述の見出し属性）に対応するアイコンを引く。
// 記法例にない独自の type を書かれた場合は該当アイコンが無いので undefined を返す。
export const getScenarioTypeIcon = (
  type: string | null | undefined,
): IconDefinition | undefined => {
  if (!type) return undefined;
  return SCENARIO_NOTATION_ICONS[type as ScenarioNotationIconKey];
};

// type（checkpoint/path/battle 等）に対応する日本語名を引く。記法例にない独自の type の
// 場合は該当ラベルが無いので undefined を返す（呼び出し側で type をそのまま表示する）。
export const getScenarioTypeLabel = (type: string | null | undefined): string | undefined => {
  if (!type) return undefined;
  return scenarioTypeLabels[type as ScenarioNotationIconKey];
};
