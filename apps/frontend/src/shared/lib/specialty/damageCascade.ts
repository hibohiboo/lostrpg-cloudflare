import { bodyParts, specialtyRows } from '@lostrpg/core/game-data/speciality';

// 身体部位の位置を見つける
const findBodyPartPosition = (
  bodyPartName: string,
): { row: number; col: number } | null => {
  for (let col = 0; col < specialtyRows.length; col += 1) {
    for (let row = 0; row < specialtyRows[col].length; row += 1) {
      if (specialtyRows[col][row].name === bodyPartName) {
        return { row, col };
      }
    }
  }
  return null;
};

// 周囲8マスのオフセット
const SURROUNDING_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

// 身体部位の周囲8マスの特技を取得する
const getSurroundingSpecialties = (bodyPartName: string): string[] => {
  const position = findBodyPartPosition(bodyPartName);
  if (!position) return [];

  const surrounding: string[] = [];

  SURROUNDING_OFFSETS.forEach(([colOffset, rowOffset]) => {
    const newCol = position.col + colOffset;
    const newRow = position.row + rowOffset;

    if (
      newCol >= 0 &&
      newCol < specialtyRows.length &&
      newRow >= 0 &&
      newRow < specialtyRows[newCol].length
    ) {
      const specialty = specialtyRows[newCol][newRow];
      if (!bodyParts.includes(specialty.name)) {
        surrounding.push(specialty.name);
      }
    }
  });

  return surrounding;
};

// 特技のダメージ状態を切り替える（身体部位は周囲8マスの特技ダメージも連動する）
export const toggleDamagedSpecialtyList = (
  damagedSpecialties: string[],
  specialtyName: string,
): string[] => {
  const next = [...damagedSpecialties];
  const index = next.indexOf(specialtyName);
  const isBodyPart = bodyParts.includes(specialtyName);

  if (index !== -1) {
    // ダメージを削除
    next.splice(index, 1);

    // 身体部位の場合、周囲8マスの特技からもダメージを削除
    if (isBodyPart) {
      const surrounding = getSurroundingSpecialties(specialtyName);

      // 他のダメージを受けている身体部位の周囲8マスを集計
      const otherDamagedBodyParts = next.filter(
        (s) => bodyParts.includes(s) && s !== specialtyName,
      );
      const protectedSpecialties = new Set<string>();
      otherDamagedBodyParts.forEach((bodyPart) => {
        getSurroundingSpecialties(bodyPart).forEach((s) =>
          protectedSpecialties.add(s),
        );
      });

      // 他の身体部位の影響を受けていない特技のみダメージを削除
      surrounding.forEach((surroundingSpecialty) => {
        if (!protectedSpecialties.has(surroundingSpecialty)) {
          const surroundingIndex = next.indexOf(surroundingSpecialty);
          if (surroundingIndex !== -1) {
            next.splice(surroundingIndex, 1);
          }
        }
      });
    }
  } else {
    // ダメージを追加
    next.push(specialtyName);

    // 身体部位の場合、周囲8マスの特技にもダメージを追加
    if (isBodyPart) {
      const surrounding = getSurroundingSpecialties(specialtyName);
      surrounding.forEach((surroundingSpecialty) => {
        if (!next.includes(surroundingSpecialty)) {
          next.push(surroundingSpecialty);
        }
      });
    }
  }

  return next;
};
