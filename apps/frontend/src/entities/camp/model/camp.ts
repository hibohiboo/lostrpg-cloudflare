import type { Facility } from '@lostrpg/frontend/entities/facility/@x/camp';
import type { Item } from '@lostrpg/frontend/entities/item/@x/camp';

export interface Camp {
  playerName: string;
  name: string;
  password?: string;
  imageUrl: string;
  facilities: Facility[];
  items: Item[];
  unusedCampPoint: number;
  totalCampPoint: number;
  summary: string;
  freeWriting: string;
}
