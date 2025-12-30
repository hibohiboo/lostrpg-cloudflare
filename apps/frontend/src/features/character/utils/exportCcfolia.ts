/* eslint-disable complexity */
import { bodyParts } from '@lostrpg/core/game-data/speciality';
import { CreateCharacterRequest } from '@lostrpg/schemas';

type CharacterClipboardData = {
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

export const characterToCcfoliaDoc = (
  character: CreateCharacterRequest,
  characterId: string,
): string => {
  const obj: CharacterClipboardData = {
    kind: 'character',
    data: {
      status: [],
      params: [],
      commands: '',
    },
  };

  obj.data.name = character.name;
  obj.data.externalUrl = `${window.location.origin}/character/${characterId}`;

  // ステータス
  obj.data.status?.push({
    label: '体力',
    value: character.stamina,
    max: character.stamina * 2,
  });
  obj.data.status?.push({
    label: '気力',
    value: character.willPower,
    max: character.willPower * 2,
  });

  // 概要
  obj.data.memo = `概要
${character.summary || ''}
`;

  // 部位（損傷状態）
  bodyParts.forEach((part) => {
    const damaged = character.damagedSpecialties?.some((s) => s.includes(part));
    obj.data.status?.push({
      label: part,
      value: damaged ? 0 : 1,
      max: 1,
    });
  });

  // 状態異常
  character.statusAilments?.forEach((ailment) => {
    obj.data.status?.push({
      label: ailment,
      value: 1,
      max: 1,
    });
  });

  // 特技
  character.specialties?.forEach((specialty) => {
    obj.data.memo = `${obj.data.memo}
特技:《${specialty}》`;
  });

  // アビリティ
  character.abilities?.forEach((ability) => {
    obj.data.params?.push({
      label: ability.name,
      value: `${ability.name}:${ability.group}/${ability.type}/${ability.specialty}/${ability.target}/${ability.recoil}/${ability.effect}`,
    });

    obj.data.commands = `${obj.data.commands}
2d6>=5 {${ability.name}}`;
  });

  // アイテム
  if (character.items && character.items.length > 0) {
    obj.data.memo = `${obj.data.memo}

アイテム`;
    character.items.forEach((item) => {
      obj.data.memo = `${obj.data.memo}
  ${item.name}:${item.number || 1}個×${item.weight}W :${item.type}/${item.specialty}/${item.target}/${item.effect}`;
    });
  }

  // 袋
  character.bags?.forEach((bag) => {
    obj.data.memo = `${obj.data.memo}

${bag.name}`;
    bag.items?.forEach((item) => {
      obj.data.memo = `${obj.data.memo}
${item.name}:${item.number || 1}個×${item.weight}W :${item.type}/${item.specialty}/${item.target}/${item.effect}`;
    });
  });

  // 装備
  character.equipments?.forEach((equipment) => {
    obj.data.params?.push({
      label: equipment.name,
      value: `${equipment.name}:${equipment.area}/${equipment.type}/${equipment.specialty}/${equipment.target}/${equipment.trait}/${equipment.effect}`,
    });
  });

  return JSON.stringify(obj);
};

export const copyCharacterToCcfolia = async (
  character: CreateCharacterRequest,
  characterId: string,
): Promise<void> => {
  const json = characterToCcfoliaDoc(character, characterId);
  await navigator.clipboard.writeText(json);
};
