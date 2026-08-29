// シナリオ詳細画面のツリー（アイコン一覧）から本文（フェイズ／シーン／イベント）の該当箇所へ
// ジャンプできるよう、両コンポーネントで共有するDOM要素IDの採番規則。
export const scenarioPhaseElementId = (phaseIndex: number): string =>
  `scenario-phase-${phaseIndex}`;

export const scenarioSceneElementId = (phaseIndex: number, sceneIndex: number): string =>
  `scenario-scene-${phaseIndex}-${sceneIndex}`;

export const scenarioEventElementId = (
  phaseIndex: number,
  sceneIndex: number,
  eventIndex: number,
): string => `scenario-event-${phaseIndex}-${sceneIndex}-${eventIndex}`;
