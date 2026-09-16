import { useGetSheetValuesQuery } from '../api/api';
import { parseNumeric } from './parseNumeric';
import { motherlessSheetNames } from './types';
import type {
  MotherlessCheckListCatalogEntry,
  MotherlessClassCatalogEntry,
  MotherlessEquipmentCatalogEntry,
  MotherlessItemCatalogEntry,
  MotherlessSkillCatalogEntry,
  MotherlessTraitCatalogEntry,
} from './types';

export const useMotherlessSkillCatalog = (): MotherlessSkillCatalogEntry[] => {
  const { data } = useGetSheetValuesQuery({
    sheetName: motherlessSheetNames.skill,
    range: 'A2:G1000',
  });
  return (data?.values ?? []).map((row) => {
    const [cls, name, type, recoil, target, element, effect] = row;
    return {
      class: cls ?? '',
      name: name ?? '',
      type: type ?? '',
      recoil: recoil ?? '',
      target: target ?? '',
      element: element ?? '',
      effect: effect ?? '',
    };
  });
};

export const useMotherlessItemCatalog = (): MotherlessItemCatalogEntry[] => {
  const { data } = useGetSheetValuesQuery({
    sheetName: motherlessSheetNames.item,
    range: 'A2:H1000',
  });
  return (data?.values ?? []).map((row) => {
    const [name, weight, type, tag, target, effect, flavor, price] = row;
    return {
      name: name ?? '',
      weight: parseNumeric(weight),
      type: type ?? '',
      tag: tag ?? '',
      target: target ?? '',
      effect: effect ?? '',
      flavor: flavor ?? '',
      price: price ?? '',
    };
  });
};

export const useMotherlessEquipmentCatalog =
  (): MotherlessEquipmentCatalogEntry[] => {
    const { data } = useGetSheetValuesQuery({
      sheetName: motherlessSheetNames.equipment,
      range: 'A2:N1000',
    });
    return (data?.values ?? []).map((row) => {
      const [
        name,
        weight,
        type,
        physicalDamage,
        elementDamage,
        accuracy,
        defense,
        evasion,
        initiativeAdjustment,
        tag,
        target,
        effect,
        flavor,
        price,
      ] = row;
      return {
        name: name ?? '',
        weight: parseNumeric(weight),
        type: type ?? '',
        physicalDamage: parseNumeric(physicalDamage),
        elementDamage: parseNumeric(elementDamage),
        accuracy: parseNumeric(accuracy),
        defense: parseNumeric(defense),
        evasion: parseNumeric(evasion),
        initiativeAdjustment: parseNumeric(initiativeAdjustment),
        tag: tag ?? '',
        target: target ?? '',
        effect: effect ?? '',
        flavor: flavor ?? '',
        price: price ?? '',
      };
    });
  };

export const useMotherlessTraitCatalog = (): MotherlessTraitCatalogEntry[] => {
  const { data } = useGetSheetValuesQuery({
    sheetName: motherlessSheetNames.trait,
    range: 'A2:B1000',
  });
  return (data?.values ?? []).map((row) => {
    const [name, description] = row;
    return { name: name ?? '', description: description ?? '' };
  });
};

export const useMotherlessClassCatalog = (): MotherlessClassCatalogEntry[] => {
  const { data } = useGetSheetValuesQuery({
    sheetName: motherlessSheetNames.class,
    range: 'A2:B1000',
  });
  return (data?.values ?? []).map((row) => {
    const [name, description] = row;
    return { name: name ?? '', description: description ?? '' };
  });
};

export const useMotherlessStatusAilmentCatalog =
  (): MotherlessCheckListCatalogEntry[] => {
    const { data } = useGetSheetValuesQuery({
      sheetName: motherlessSheetNames.statusAilment,
      range: 'A2:B1000',
    });
    return (data?.values ?? []).map((row) => {
      const [name, effect] = row;
      return { name: name ?? '', effect: effect ?? '' };
    });
  };

export const useMotherlessBodyDamageCatalog =
  (): MotherlessCheckListCatalogEntry[] => {
    const { data } = useGetSheetValuesQuery({
      sheetName: motherlessSheetNames.bodyDamage,
      range: 'A2:B1000',
    });
    return (data?.values ?? []).map((row) => {
      const [name, effect] = row;
      return { name: name ?? '', effect: effect ?? '' };
    });
  };
