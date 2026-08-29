export type StructuredSelection =
  | { kind: 'phase'; phaseIndex: number }
  | { kind: 'scene'; phaseIndex: number; sceneIndex: number }
  | { kind: 'event'; phaseIndex: number; sceneIndex: number; eventIndex: number };

export const phaseNodeId = (phaseIndex: number): string => `phase-${phaseIndex}`;

export const sceneNodeId = (phaseIndex: number, sceneIndex: number): string =>
  `${phaseNodeId(phaseIndex)}-scene-${sceneIndex}`;

export const eventNodeId = (
  phaseIndex: number,
  sceneIndex: number,
  eventIndex: number,
): string => `${sceneNodeId(phaseIndex, sceneIndex)}-event-${eventIndex}`;

const EVENT_ID_RE = /^phase-(\d+)-scene-(\d+)-event-(\d+)$/;
const SCENE_ID_RE = /^phase-(\d+)-scene-(\d+)$/;
const PHASE_ID_RE = /^phase-(\d+)$/;

// ツリーのitemIdから、選択されたノードの種類と位置を復元する
export const parseNodeId = (id: string | null): StructuredSelection | null => {
  if (!id) return null;

  const eventMatch = EVENT_ID_RE.exec(id);
  if (eventMatch) {
    return {
      kind: 'event',
      phaseIndex: Number(eventMatch[1]),
      sceneIndex: Number(eventMatch[2]),
      eventIndex: Number(eventMatch[3]),
    };
  }

  const sceneMatch = SCENE_ID_RE.exec(id);
  if (sceneMatch) {
    return {
      kind: 'scene',
      phaseIndex: Number(sceneMatch[1]),
      sceneIndex: Number(sceneMatch[2]),
    };
  }

  const phaseMatch = PHASE_ID_RE.exec(id);
  if (phaseMatch) {
    return { kind: 'phase', phaseIndex: Number(phaseMatch[1]) };
  }

  return null;
};
