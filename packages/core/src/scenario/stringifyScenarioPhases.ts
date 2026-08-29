import type {
  ScenarioEvent,
  ScenarioEventItem,
  ScenarioLink,
  ScenarioPhase,
  ScenarioScene,
  ScenarioTable,
} from '@lostrpg/schemas';

// parseScenarioContent の逆変換：フェイズ／シーン／イベントの構造をMarkdown本文に書き戻す。
// 構造化編集タブでの編集結果を、Markdown編集タブと同期させるために使用する。
//
// 各 `stringifyXxx` は対応する `handleXxx`（parseScenarioContent.ts）が生成する構造と
// 1:1で対応しており、`parseScenarioContent(stringifyScenarioPhases(phases))` が
// 元の phases と一致するように実装している（ユニットテストでラウンドトリップを検証）。

const buildAttributeSuffix = (attrs: Array<string | null | undefined | false>): string => {
  const nonEmpty = attrs.filter((a): a is string => !!a);
  if (nonEmpty.length === 0) return '';
  return ` {.${nonEmpty.join(' .')}}`;
};

const stringifyItem = (item: ScenarioEventItem): string => `##### ${item.name} {.${item.type}}`;

// 複数の表が連続しても混ざらないよう、表題の有無にかかわらず必ず見出しを前置する
const stringifyTable = (table: ScenarioTable): string => {
  const heading = table.title ? `##### ${table.title} {.table}` : '##### {.table}';
  const header = `| ${table.columns.join(' | ')} |`;
  const separator = `| ${table.columns.map(() => '---').join(' | ')} |`;
  const rows = table.rows.map((row) => `| ${row.cells.join(' | ')} |`);
  return [heading, '', header, separator, ...rows].join('\n');
};

const stringifyLinks = (links: ScenarioLink[]): string =>
  links.map((link) => `[${link.value}](${link.url})`).join('\n');

const stringifyEvent = (event: ScenarioEvent): string => {
  // type: 'view' は「属性なし」のデフォルト値なので、見出しには付与しない
  const attrSuffix = buildAttributeSuffix([event.type !== 'view' ? event.type : undefined]);
  const parts: string[] = [`#### ${event.name}${attrSuffix}`];

  if (event.lines.length > 0) parts.push(event.lines.join('\n'));
  event.items.forEach((item) => parts.push(stringifyItem(item)));
  event.tables.forEach((table) => parts.push(stringifyTable(table)));
  if (event.links.length > 0) parts.push(stringifyLinks(event.links));

  return parts.join('\n\n');
};

const stringifyScene = (scene: ScenarioScene): string => {
  const attrSuffix = buildAttributeSuffix([
    scene.type ? `type-${scene.type}` : undefined,
    scene.alias ? `alias-${scene.alias}` : undefined,
    scene.next && scene.next.length > 0 ? `next-${scene.next.join('-')}` : undefined,
  ]);
  const parts: string[] = [`### ${scene.name}${attrSuffix}`];

  if (scene.lines.length > 0) parts.push(scene.lines.join('\n'));
  scene.events.forEach((event) => parts.push(stringifyEvent(event)));

  return parts.join('\n\n');
};

const stringifyPhase = (phase: ScenarioPhase): string => {
  const parts: string[] = [`## ${phase.name}`];
  phase.scenes.forEach((scene) => parts.push(stringifyScene(scene)));
  return parts.join('\n\n');
};

export const stringifyScenarioPhases = (phases: ScenarioPhase[]): string =>
  phases.map(stringifyPhase).join('\n\n');
