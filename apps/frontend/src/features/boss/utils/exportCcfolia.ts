import { calcBossStamina, calcBossWillPower } from '../model/bossSlice';
import type { BossFormData } from '../model/bossSlice';

type BossClipboardData = {
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

export const bossToCcfoliaDoc = (boss: BossFormData, bossId: string): string => {
  const obj: BossClipboardData = {
    kind: 'character',
    data: {
      status: [],
      params: [],
      commands: '',
    },
  };

  obj.data.name = boss.name;
  obj.data.externalUrl = `${window.location.origin}/boss/${bossId}`;
  obj.data.iconUrl = boss.imageUrl || null;

  // ステータス
  obj.data.status?.push({
    label: '体力',
    value: boss.stamina,
    max: calcBossStamina(boss.level),
  });
  obj.data.status?.push({
    label: '気力',
    value: boss.willPower,
    max: calcBossWillPower(boss.level),
  });

  // メモ（レベル・外見）
  obj.data.memo = `レベル: ${boss.level}
${boss.appearance || ''}`;

  // アビリティ
  boss.abilities.forEach((ability) => {
    obj.data.params?.push({
      label: ability.name,
      value: `${ability.name}:${ability.group}/${ability.type}/${ability.specialty}/${ability.target}/${ability.recoil}/${ability.effect}`,
    });

    obj.data.commands = `${obj.data.commands}
2d6>=5 {${ability.name}}`;
  });

  return JSON.stringify(obj);
};

export const copyBossToCcfolia = async (
  boss: BossFormData,
  bossId: string,
): Promise<void> => {
  const json = bossToCcfoliaDoc(boss, bossId);
  await navigator.clipboard.writeText(json);
};
