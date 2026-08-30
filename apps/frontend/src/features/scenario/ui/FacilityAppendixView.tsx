import React from 'react';
import { FacilityTable } from '@lostrpg/frontend/entities/facility';
import type { ScenarioFacilityAppendix } from '@lostrpg/frontend/entities/scenario';

type Props = {
  facilities: ScenarioFacilityAppendix[];
};

// 施設付録の詳細表示：キャンプと同じ表（FacilityTable）を読み取り専用で表示する。
export const FacilityAppendixView: React.FC<Props> = ({ facilities }) => {
  if (facilities.length === 0) return null;

  return (
    <FacilityTable
      facilities={facilities}
      handleFacilityDelete={() => {}}
      handleFacilityUpdate={(row) => row}
      hideActions
    />
  );
};
