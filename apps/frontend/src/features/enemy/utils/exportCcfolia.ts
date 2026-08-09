import type { EnemyFormData } from '../model/enemySlice';

type EnemyClipboardData = {
  kind: 'character';
  data: Partial<CcfoliaCharacter>;
};

type CcfoliaCharacter = {
  name: string;
  memo: string;
  initiative?: number;
  externalUrl: string;
  status: {
    label: string;
    value: number;
    max: number;
  }[];
  params: { label: string; value: string }[];
  iconUrl: string | null;
  faces?: { iconUrl: string | null; label: string }[];
  x?: number;
  y?: number;
  angle?: number;
  width?: number;
  height?: number;
  active?: boolean;
  secret?: boolean;
  invisible?: boolean;
  hideStatus?: boolean;
  color?: string;
  commands?: string;
  owner?: string | null;
};

export const enemyToCcfoliaDoc = (
  enemy: EnemyFormData,
  enemyId: string,
): string => {
  const obj: EnemyClipboardData = {
    kind: 'character',
    data: {
      status: [],
      params: [],
      commands: '',
    },
  };

  obj.data.name = enemy.name;
  obj.data.externalUrl = `${window.location.origin}/enemy/${enemyId}`;
  obj.data.iconUrl = enemy.imageUrl || null;

  // ステータス
  obj.data.status?.push({
    label: '体力',
    value: enemy.stamina,
    max: enemy.stamina,
  });
  obj.data.status?.push({
    label: '気力',
    value: enemy.willPower,
    max: enemy.willPower,
  });

  // メモ（レベル・タイプ・外見）
  obj.data.memo = `レベル: ${enemy.level}
タイプ: ${enemy.type || ''}
${enemy.appearance || ''}`;

  // 特技
  enemy.specialties.forEach((specialty) => {
    obj.data.memo = `${obj.data.memo}
特技:《${specialty}》`;
  });

  // ドロップアイテム
  if (enemy.dropItems.some((item) => item)) {
    obj.data.memo = `${obj.data.memo}

ドロップアイテム`;
    enemy.dropItems.forEach((item, index) => {
      if (!item) return;
      obj.data.memo = `${obj.data.memo}
${index + 1}: ${item}`;
    });
  }

  // アビリティ
  enemy.abilities.forEach((ability) => {
    obj.data.params?.push({
      label: ability.name,
      value: `${ability.name}:${ability.group}/${ability.type}/${ability.specialty}/${ability.target}/${ability.recoil}/${ability.effect}`,
    });

    obj.data.commands = `${obj.data.commands}
2d6>=5 {${ability.name}}`;
  });

  return JSON.stringify(obj);
};

export const copyEnemyToCcfolia = async (
  enemy: EnemyFormData,
  enemyId: string,
): Promise<void> => {
  const json = enemyToCcfoliaDoc(enemy, enemyId);
  await navigator.clipboard.writeText(json);
};
