import { specialties } from '@lostrpg/core/game-data/speciality';
import { floor } from 'lodash';

export const checkSpecialties = (from: string, to: string, gaps: string[]) => {
  const base = 5;
  if (from === to) return base;
  const rowNumber = 11;
  const target = specialties.indexOf(to);
  const tX = floor(target / rowNumber);
  const tY = target % rowNumber;
  const sp = specialties.indexOf(from);
  const sX = floor(sp / rowNumber);
  const sY = sp % rowNumber;
  let point = Math.abs(tX - sX) * 2 + Math.abs(tY - sY);
  ['A', 'B', 'C', 'D', 'E'].forEach((x, i) => {
    const position = i + 1;
    if (
      ((tX < position && position <= sX) ||
        (sX < position && position <= tX)) &&
      gaps.includes(x)
    )
      point -= 1;
  });

  return point + base;
};
