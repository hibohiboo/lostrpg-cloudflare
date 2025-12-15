/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  useSpreadSheetItemData,
  useSpreadSheetSkillData,
  useSpreadSheetUltimateData,
} from '@lostrpg/frontend/shared/spreadsheet';
import type { CharacterFormData } from '@lostrpg/ui';

interface CharacterDetail {
  id: string;
  name: string;
  selectedClasses?: [string, string];
  abilityBonus?: string;
  skillPointsLimit?: number;
  heroSkillLevelLimit?: number;
  itemPriceLimit?: number;
  skillAllocations?: Record<string, number>;
  heroSkills?: any[];
  specialAttacks?: any[];
  items?: any[];
  status?: {
    hp: number;
    sp: number;
    actionValue: number;
  };
  statusModifiers?: {
    hpModifier: number;
    spModifier: number;
    actionValueModifier: number;
  };
  sessions?: any[];
}

export const useCharacterEdit = (id: string | undefined) => {
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const skillData = useSpreadSheetSkillData();
  const ultimateSkillData = useSpreadSheetUltimateData();
  const presetItems = useSpreadSheetItemData();
  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        setError('キャラクターIDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/characters/${id}`);

        if (!response.ok) {
          throw new Error('キャラクターの取得に失敗しました');
        }

        const data = await response.json();
        setCharacter(data);
      } catch (e: unknown) {
        console.error('キャラクター取得エラー:', e);
        setError('キャラクターの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleSubmit = async (data: CharacterFormData) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('キャラクター更新に失敗しました');
      }

      navigate(`/character/${id}`);
    } catch (e) {
      console.error('キャラクター更新エラー:', e);
      alert('キャラクター更新に失敗しました。');
    }
  };

  const navigateToCharacterList = () => {
    navigate('/character-list');
  };

  return {
    character,
    loading,
    error,
    handleSubmit,
    navigateToCharacterList,
    skillData,
    ultimateSkillData,
    presetItems,
  };
};
