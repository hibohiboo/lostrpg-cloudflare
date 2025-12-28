type Gap = 'A' | 'B' | 'C' | 'D' | 'E';

interface SpecialtyCell {
  name: string;
  selected: boolean;
  damaged: boolean;
  isBodyParts?: boolean;
}

interface SpecialtyRow {
  number: number;
  talent: SpecialtyCell;
  a: SpecialtyCell;
  head: SpecialtyCell;
  b: SpecialtyCell;
  arms: SpecialtyCell;
  c: SpecialtyCell;
  torso: SpecialtyCell;
  d: SpecialtyCell;
  legs: SpecialtyCell;
  e: SpecialtyCell;
  survival: SpecialtyCell;
}

interface Column {
  name: string;
  selected?: boolean;
}
interface SpecialtiesTableProps {
  rows: SpecialtyRow[];
  columns: Column[];
  gaps: Gap[];
  damagedSpecialties: string[];
  onGapChange?: (gap: Gap) => void;
  onSpecialtySelect?: (name: string) => void;
  onDamageChange?: (name: string) => void;
  readOnly?: boolean;
}

export const SpecialtiesTable: React.FC<SpecialtiesTableProps> = () => (
  <div></div>
);
