import type {
  ScenarioEvent,
  ScenarioPhase,
  ScenarioScene,
} from '@lostrpg/frontend/entities/scenario';

export const createPhase = (): ScenarioPhase => ({ name: '新しいフェイズ', scenes: [] });

export const createScene = (): ScenarioScene => ({
  name: '新しいチェックポイント',
  type: 'checkpoint',
  alias: null,
  next: null,
  lines: [],
  events: [],
});

export const createEvent = (): ScenarioEvent => ({
  name: '新しいイベント',
  type: 'view',
  lines: [],
  items: [],
  tables: [],
  links: [],
});

export const addPhase = (phases: ScenarioPhase[]): ScenarioPhase[] => [
  ...phases,
  createPhase(),
];

export const updatePhase = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  changes: Partial<ScenarioPhase>,
): ScenarioPhase[] =>
  phases.map((phase, pi) => (pi === phaseIndex ? { ...phase, ...changes } : phase));

export const removePhase = (phases: ScenarioPhase[], phaseIndex: number): ScenarioPhase[] =>
  phases.filter((_, pi) => pi !== phaseIndex);

export const addScene = (phases: ScenarioPhase[], phaseIndex: number): ScenarioPhase[] =>
  phases.map((phase, pi) =>
    pi === phaseIndex ? { ...phase, scenes: [...phase.scenes, createScene()] } : phase,
  );

export const updateScene = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  sceneIndex: number,
  changes: Partial<ScenarioScene>,
): ScenarioPhase[] =>
  phases.map((phase, pi) => {
    if (pi !== phaseIndex) return phase;
    return {
      ...phase,
      scenes: phase.scenes.map((scene, si) => (si === sceneIndex ? { ...scene, ...changes } : scene)),
    };
  });

export const removeScene = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  sceneIndex: number,
): ScenarioPhase[] =>
  phases.map((phase, pi) =>
    pi === phaseIndex
      ? { ...phase, scenes: phase.scenes.filter((_, si) => si !== sceneIndex) }
      : phase,
  );

export const addEvent = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  sceneIndex: number,
): ScenarioPhase[] =>
  phases.map((phase, pi) => {
    if (pi !== phaseIndex) return phase;
    return {
      ...phase,
      scenes: phase.scenes.map((scene, si) =>
        si === sceneIndex ? { ...scene, events: [...scene.events, createEvent()] } : scene,
      ),
    };
  });

export const updateEvent = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  sceneIndex: number,
  eventIndex: number,
  changes: Partial<ScenarioEvent>,
): ScenarioPhase[] =>
  phases.map((phase, pi) => {
    if (pi !== phaseIndex) return phase;
    return {
      ...phase,
      scenes: phase.scenes.map((scene, si) => {
        if (si !== sceneIndex) return scene;
        return {
          ...scene,
          events: scene.events.map((event, ei) => (ei === eventIndex ? { ...event, ...changes } : event)),
        };
      }),
    };
  });

export const removeEvent = (
  phases: ScenarioPhase[],
  phaseIndex: number,
  sceneIndex: number,
  eventIndex: number,
): ScenarioPhase[] =>
  phases.map((phase, pi) => {
    if (pi !== phaseIndex) return phase;
    return {
      ...phase,
      scenes: phase.scenes.map((scene, si) =>
        si === sceneIndex
          ? { ...scene, events: scene.events.filter((_, ei) => ei !== eventIndex) }
          : scene,
      ),
    };
  });
