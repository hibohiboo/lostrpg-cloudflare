import type {
  AbilityBase,
  Ability as SchemaAbility,
} from '@lostrpg/schemas/validation/character';

export type Ability = SchemaAbility;

export type AbilityGroup = {
  name: string;
  id: string;
  list: readonly AbilityBase[];
};
